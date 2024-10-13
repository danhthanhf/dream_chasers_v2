package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.CommentDTO;
import com.dreamchasers.recoverbe.dto.PagePostDTO;
import com.dreamchasers.recoverbe.dto.PostDTO;
import com.dreamchasers.recoverbe.dto.UserBasicDTO;
import com.dreamchasers.recoverbe.helper.Handle.ConvertService;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.model.Post.Post;
import com.dreamchasers.recoverbe.model.Post.PostStatus;
import com.dreamchasers.recoverbe.model.User.Comment;
import com.dreamchasers.recoverbe.model.User.User;
import com.dreamchasers.recoverbe.repository.CommentRepository;
import com.dreamchasers.recoverbe.repository.PostRepository;
import com.dreamchasers.recoverbe.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.xmlunit.util.Convert;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Transactional
@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagService tagService;
    private final ConvertService convertService;
    private final UserService userService;
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;


    public ResponseObject updateStatus(UUID id, String status, int page, int size) {
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Post not found").build();
        }
        post.setStatus(PostStatus.valueOf(status));
        notificationService.adminSendProcessDataPost(post.getUser(), post);
        postRepository.save(post);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public ResponseObject likePost(UUID postId, String email) {
        var post = postRepository.findById(postId).orElse(null);
        if(post == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Page not found!").build();
        }
        var user = userService.getUserByEmail(email);
        if(user.getContent() == null)
            return user;
        var user1 = (User) user.getContent();
        if(user1.getFavoritePosts().contains(post)) {
            user1.getFavoritePosts().remove(post);
            post.setLikes(post.getLikes() - 1);
        } else {
            user1.getFavoritePosts().add(post);
            post.setLikes(post.getLikes() + 1);
        }
        userRepository.save(user1);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public ResponseObject addView(UUID postId) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Post not found").build();
        }
        post.setViews(post.getViews() + 1);
        postRepository.save(post);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public Post findById(UUID id) {
        return postRepository.findById(id).orElse(null);
    }

    public Post findByTitle(String title) {
        return postRepository.findByTitle(title);
    }

    public ResponseObject createPost(Post post, String email) {
        Post post1 = postRepository.findByTitle(post.getTitle());
        if(post1 != null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Post already exists").build();
        }
        User user = (User) userService.getUserByEmail(email).getContent();
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("User not found").build();
        }
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setTags(tagService.saveTags(post.getTags()));
        postRepository.save(post);
        return ResponseObject.builder().status(HttpStatus.OK).message("Publish post successfully").build();
    }

    public ResponseObject getMoreComments(UUID postId, int page, int size) {
        return ResponseObject.builder().status(HttpStatus.OK).content(getCommentsByPost(postId, page, size)).build();
    }

    public Deque<CommentDTO> getCommentsByPost(UUID postId, int page, int size) {
        var comments = commentRepository.findAllByPostIdAndParentCommentIdOrderByCreatedAt( postId,null, PageRequest.of(page, size));

        if (comments.getSize() == 0) {
            return null;
        }

        return comments.stream().map(convertService::convertToCommentDTO).sorted(
                (o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt())
        ).collect(Collectors.toCollection(ArrayDeque::new));
    }

    private boolean isContainComment(Deque<CommentDTO> comments, UUID commentId) {
        if(comments == null || comments.isEmpty()) {
            return false;
        }
        return comments.stream().anyMatch(dto -> dto.getId() == commentId);
    }

    public void addWatchComment(PostDTO post, UUID commentId) {
        if(post == null) {
            return;
        }
        if(commentId != null && isContainComment(post.getComments(), commentId)) {
            commentRepository.findById(commentId).ifPresent(comment -> post.getComments()
                    .addFirst(convertService.convertToCommentDTO(comment)));
        }
    }

    public ResponseObject getByTitle(String title, UUID watch, int page, int size) {
        Post post = postRepository.findByTitle(title);
        if (post == null) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Post not found").build();
        }

        var isFavorite = userService.isPostFavorite(SecurityContextHolder.getContext().getAuthentication().getName(), post);

        var postDTO = transformPostDTO(post, page, size);
        postDTO.setFavorite(isFavorite);

        if(watch != null)
            addWatchComment(postDTO, watch);

        return ResponseObject.builder().status(HttpStatus.OK).content(postDTO).build();
    }


    public ResponseObject getPosts(int page, int size){
        var pagePost = postRepository.findAllByDeletedAndStatus(false, PostStatus.APPROVED, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        PagePostDTO pagePostDTO = PagePostDTO.builder()
                .posts(pagePost.getContent().stream().map(comment ->transformPostDTO(comment, page, size)).toList())
                .totalPage(pagePost.getTotalPages())
                .totalElement(pagePost.getTotalElements())
                .build();
        return ResponseObject.builder().status(HttpStatus.OK).content(pagePostDTO).build();
    }

    public Post saveComment(UUID postId, Comment comment) {
        Post post = findById(postId);
        if (post == null) {
            return null;
        }
        post.getComments().add(comment);
        post.setTotalComment(post.getComments().size());
        return post;
    }

    public int getTotalMainComments(UUID postId) {
        return commentRepository.countTotalMainComment(postId);
    }

    public PostDTO transformPostDTO(Post post, int page, int size) {
        var comments = getCommentsByPost(post.getId(), page, size);
        boolean liked = post.getUser().getFavoritePosts().contains(post);
        int totalMainComment = getTotalMainComments(post.getId());
        var totalPageComment = totalMainComment / 5 + 1;

        return PostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .email(post.getUser().getEmail())
                .totalPageComment(totalPageComment)
                .tags(post.getTags())
                .totalComment(post.getTotalComment())
                .description(post.getDescription())
                .views(post.getViews())
                .likes(post.getLikes())
                .liked(liked)
                .comments(comments)
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .userName(post.getUser().getFirstName() + " " + post.getUser().getLastName())
                .thumbnail(post.getThumbnail())
                .userAvatar(post.getUser().getAvatarUrl())
                .status(post.getStatus())
                .build();
    }

    public ResponseObject getAllByStatus(String status, int page, int size) {
        Page<Post> result;
        if (Objects.equals(status, PostStatus.ALL.toString())) {
            result = postRepository.findAllByDeleted(false, PageRequest.of(page, size));
        }
        else
            result = postRepository.findAllByDeletedAndStatus(false, PostStatus.valueOf(status), PageRequest.of(page, size));
        List<PostDTO> response = result.stream().map(post -> transformPostDTO(post, 0, 5)).toList();
        long totalApprovedPosts = postRepository.countByStatusAndDeleted(PostStatus.APPROVED, false);
        long totalRejectedPosts = postRepository.countByStatusAndDeleted(PostStatus.REJECTED, false);
        long totalPendingPosts = postRepository.countByStatusAndDeleted(PostStatus.PENDING, false);
        PagePostDTO pagePostDTO = PagePostDTO.builder()
                .posts(response)
                .totalPage(result.getTotalPages())
                .totalElement(result.getTotalElements())
                .totalApproved(totalApprovedPosts)
                .totalPending(totalPendingPosts)
                .totalRejected(totalRejectedPosts)
                .build();
        return ResponseObject.builder().status(HttpStatus.OK).content(pagePostDTO).build();
    }

    public ResponseObject getAllByStatusAndTitle(String title, String status, int page, int size) {
        Page<Post> result;
        if (Objects.equals(status, com.dreamchasers.recoverbe.model.Post.PostStatus.ALL.toString()))
            result = postRepository.findAllByTitleAndStatusAndDeleted(title, false, PageRequest.of(page, size));
        else
            result = postRepository.findAllByTitleAndStatusAndIsDeleted(title, com.dreamchasers.recoverbe.model.Post.PostStatus.valueOf(status), false, PageRequest.of(page, size));
        Page<PostDTO> response = result.map(post ->transformPostDTO(post, 0, 5));
        return ResponseObject.builder().status(HttpStatus.OK).content(response).build();
    }


}
