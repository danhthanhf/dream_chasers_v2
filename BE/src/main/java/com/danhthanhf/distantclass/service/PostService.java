package com.danhthanhf.distantclass.service;

import com.danhthanhf.distantclass.dto.CommentDTO;
import com.danhthanhf.distantclass.dto.PagePostDTO;
import com.danhthanhf.distantclass.dto.PostDTO;
import com.danhthanhf.distantclass.dto.StatusChangeDTO;
import com.danhthanhf.distantclass.entity.User.Notification;
import com.danhthanhf.distantclass.common.enums.ReferenceType;
import com.danhthanhf.distantclass.exception.EntityNotFoundException;
import com.danhthanhf.distantclass.exception.PermissionDeniedException;
import com.danhthanhf.distantclass.helper.converters.ConvertService;
import com.danhthanhf.distantclass.common.util.PermissionUtils;
import com.danhthanhf.distantclass.common.response.ResponseObject;
import com.danhthanhf.distantclass.entity.post.Post;
import com.danhthanhf.distantclass.entity.User.Comment;
import com.danhthanhf.distantclass.entity.User.User;
import com.danhthanhf.distantclass.common.enums.CoursePostStatus;
import com.danhthanhf.distantclass.repository.CommentRepository;
import com.danhthanhf.distantclass.repository.PostRepository;
import com.danhthanhf.distantclass.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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

    public List<Post> getPostsByUserEmail(User user) {
        return postRepository.findAllByUserAndStatusAndDeleted(user, CoursePostStatus.APPROVED, false, PageRequest.of(0, 5)).getContent();

    }

    public void updatePost(Post post, Post newPost) {
        post.setStatus(newPost.getStatus());
        post.setContent(newPost.getContent());
        post.setReasonReject(newPost.getReasonReject());
        post.setDescription(newPost.getDescription());
        post.setTags(null);
        post.setTags(tagService.saveTags(newPost.getTags()));
        postRepository.save(post);
    }

    public ResponseObject updatePost(UUID postId, Post newPost) {
        if(userService.getCurrentUser().equals(newPost.getUser()))
            throw new PermissionDeniedException("You don't have permission to update this post");
        var existPost = postRepository.findById(postId).orElseThrow(() -> new EntityNotFoundException("Post not found"));
        updatePost(existPost, newPost);
        var postDTO = convertService.convertToPostDTO(existPost);
        return ResponseObject.builder().status(HttpStatus.OK).content(postDTO).build();
    }

    public ResponseObject getPostListByUser(CoursePostStatus status, boolean delete, int page, int size) {
        var user = userService.getCurrentUser();

        var postsPage = postRepository.findAllByUserAndStatusAndDeleted(user, status, delete, PageRequest.of(page, size));

        var response = convertService.convertToPagePostDTO(postsPage);
        return ResponseObject.builder().status(HttpStatus.OK).content(response).build();
    }

    public ResponseObject adminChangeStatus(UUID postId, StatusChangeDTO status) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new EntityNotFoundException("Post not found"));
        post.setReasonReject(status.getDetail());
        post.setStatus(status.getStatus());

        var noti = Notification.builder()
                .recipient(post.getUser())
                .postTitle(post.getTitle())
                .title("Your post was " + status.getStatus() + " by ADMIN")
                .referenceType(ReferenceType.POST)
                .type(notificationService.getNotificationType(status.getStatus(), false))
                .build();
        notificationService.sendNotificationToUser(noti);

        postRepository.save(post);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public ResponseObject userChangeStatus(UUID id, CoursePostStatus status) {
        Post post = postRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if(status == post.getStatus())
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Status is the same").build();

        PermissionUtils.checkPermission(post.getUser().getEmail());

        if(status == CoursePostStatus.PUBLISHED)
            post.setStatus(CoursePostStatus.PENDING);
        else
            post.setStatus(status);

        postRepository.save(post);
            var postDTO = convertService.convertToPostDTO(post);
        return ResponseObject.builder().content(postDTO).status(HttpStatus.OK).build();
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
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("user not found").build();
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
            return comments.stream().anyMatch(dto -> dto.getId().equals(commentId));
    }


    private void addWatchComment(PostDTO post, UUID commentId) {
        if(post == null) {
            return;
        }
        if (commentId != null) {
            Comment temp = commentRepository.findById(commentId).orElseThrow(() -> new EntityNotFoundException("Comment not found"));
            CommentDTO cmt = convertService.convertToCommentDTO(temp);
            if(isContainComment(post.getComments(), commentId)) {
                post.getComments().removeIf(dto -> dto.getId() == commentId);
            }

            post.getComments().addFirst(cmt);
        }
    }

    public ResponseObject getByTitle(String title, UUID watch, int page, int size) {
        Post post = findByTitle(title);

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
        var pagePost = postRepository.findAllByDeletedAndStatus(false, CoursePostStatus.APPROVED, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        PagePostDTO pagePostDTO = PagePostDTO.builder()
                .posts(pagePost.getContent().stream().map(comment ->transformPostDTO(comment, page, size)).toList())
                .totalPage(pagePost.getTotalPages())
                .totalElement(pagePost.getTotalElements())
                .build();
        return ResponseObject.builder().status(HttpStatus.OK).content(pagePostDTO).build();
    }

    public Post saveComment(String title, Comment comment) {
        Post post = findByTitle(title);
        if (post == null) {
            return null;
        }
        post.getComments().add(comment);
        post.setTotalComment(post.getComments().size());
        return post;
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

    public int countMainComment(Post post) {
        return (int) post.getComments().stream().filter(comment -> comment.getParentComment() == null).count();
    }

    public PostDTO transformPostDTO(Post post, int page, int size) {
        var comments = getCommentsByPost(post.getId(), page, size);
        boolean liked = post.getUser().getFavoritePosts().contains(post);
        var totalPageComment = countMainComment(post) / size + 1;

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
        if (Objects.equals(status, CoursePostStatus.ALL.toString())) {
            result = postRepository.findAllByDeleted(false, PageRequest.of(page, size));
        }
        else
            result = postRepository.findAllByDeletedAndStatus(false, CoursePostStatus.valueOf(status), PageRequest.of(page, size));
        List<PostDTO> response = result.stream().map(post -> transformPostDTO(post, 0, 5)).toList();
        long totalRejectedPosts = postRepository.countByStatusAndDeleted(CoursePostStatus.REJECTED, false);
        long totalPendingPosts = postRepository.countByStatusAndDeleted(CoursePostStatus.PENDING, false);
        long totalApprovedPosts = postRepository.countByStatusAndDeleted(CoursePostStatus.APPROVED, false);
        long totalPost = totalRejectedPosts + totalApprovedPosts + totalPendingPosts;

        PagePostDTO pagePostDTO = PagePostDTO.builder()
                .posts(response)
                .totalPage(result.getTotalPages())
                .totalElement(totalPost)
                .totalApproved(totalApprovedPosts)
                .totalPending(totalPendingPosts)
                .totalRejected(totalRejectedPosts)
                .build();
        return ResponseObject.builder().status(HttpStatus.OK).content(pagePostDTO).build();
    }

    public ResponseObject getAllByStatusAndTitle(String title, String status, int page, int size) {
        Page<Post> result;
        if (Objects.equals(status, CoursePostStatus.ALL.toString()))
            result = postRepository.findAllByTitleAndStatusAndDeleted(title, false, PageRequest.of(page, size));
        else
            result = postRepository.findAllByTitleAndStatusAndIsDeleted(title, CoursePostStatus.valueOf(status), false, PageRequest.of(page, size));
        Page<PostDTO> response = result.map(post ->transformPostDTO(post, 0, 5));
        return ResponseObject.builder().status(HttpStatus.OK).content(response).build();
    }


}
