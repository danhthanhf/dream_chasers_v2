package com.example.demo.service;

import com.example.demo.cloudinary.CloudService;
import com.example.demo.dto.CommentDTO;
import com.example.demo.dto.PagePostDTO;
import com.example.demo.dto.PostDTO;
import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.data.Comment;
import com.example.demo.entity.data.Post;
import com.example.demo.entity.data.PostStatus;
import com.example.demo.entity.user.User;
import com.example.demo.repository.data.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final CloudService cloudService;
    private final UserService userService;
    private final NotificationService notificationService;

    @Autowired
    public PostService(PostRepository postRepository, CloudService cloudService, UserService userService, NotificationService notificationService) {
        this.postRepository = postRepository;
        this.cloudService = cloudService;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    public ResponseObject getPostsByTitleAndStatus(String title, String status, int page, int size) {
        Page<Post> result;
        if (Objects.equals(status, PostStatus.ALL.toString()))
            result = postRepository.findAllByTitleAndStatusAndIsDeleted(title, false, PageRequest.of(page, size));
        else
            result = postRepository.findAllByTitleAndStatusAndIsDeleted(title, PostStatus.valueOf(status), false, PageRequest.of(page, size));
        Page<PostDTO> response = result.map(this::transformPostDTO);
        return ResponseObject.builder().status(HttpStatus.OK).content(response).build();
    }


    public ResponseObject updatePost(Post post, String email) {
        var postExist = postRepository.findById(post.getId()).orElse(null);
        if (postExist == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Post not found").build();
        }
        if(!Objects.equals(postExist.getUser().getEmail(), email)) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("This user not have permission for this post").build();
        }


        postExist.setContent(post.getContent());
        postExist.setTitle(post.getTitle());
        postRepository.save(postExist);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Publish post successfully").build();
    }

    public ResponseObject getListPostOfUser(String email) {
        var posts = postRepository.findByUserEmailAndAndIsDeleted(email, false, PageRequest.of(0, 10));
        return ResponseObject.builder().status(HttpStatus.OK).content(posts).build();
    }

    public ResponseObject updateDeletePostOfUserById(String email, int postId, boolean deleted) {
        var post = postRepository.findById(postId).orElse(null);

        if(post == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("Post not found").build();
        }
        if(!Objects.equals(post.getUser().getEmail(), email)) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).content("User not have permission with this post").build();
        }

        post.setDeleted(deleted);
        postRepository.save(post);

        return ResponseObject.builder().content("Update post successfully").status(HttpStatus.OK).build();
    }

    public ResponseObject updateStatus(int id, String status, int page, int size) {
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).mess("Post not found").build();
        }
        post.setStatus(PostStatus.valueOf(status));
        notificationService.sendNotificationToUser(null, post.getUser().getEmail(), "Your post \"" + post.getTitle() + "\" has been " + status.toLowerCase());
        postRepository.save(post);
        return getAll("ALL", page, size);
    }

    public ResponseObject getAll(String status, int page, int size) {
        Page<Post> result;
        if (Objects.equals(status, PostStatus.ALL.toString())) {
               result = postRepository.findAllByIsDeleted(false, PageRequest.of(page, size));
        }
        else
            result = postRepository.findAllByIsDeletedAndStatus(false, PostStatus.valueOf(status), PageRequest.of(page, size));
        List<PostDTO> response = result.stream().map(this::transformPostDTO).toList();
        long totalApprovedPosts = postRepository.countByStatusAndIsDeleted(PostStatus.APPROVED, false);
        long totalRejectedPosts = postRepository.countByStatusAndIsDeleted(PostStatus.REJECTED, false);
        long totalPendingPosts = postRepository.countByStatusAndIsDeleted(PostStatus.PENDING, false);
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

    public void sendNotificationToPostUser(CommentDTO commentDTO, int postId) {
        Post post = findById(postId);
        if (post == null)
            return;
        if(Objects.equals(post.getUser().getEmail(), commentDTO.getEmail()))
            return;
        notificationService.sendNotificationToUser(commentDTO, post.getUser().getEmail(), "commented on your post");

    }

    public boolean saveComment(int postId, Comment comment) {
        Post post = findById(postId);
        if (post == null) {
            return false;
        }
        post.getComments().add(comment);
        post.setTotalComment(post.getComments().size());
        return true;
    }

    public Post findById(int id) {
        return postRepository.findById(id).orElse(null);
    }

    public ResponseObject getPostByTitle(String title, String email) {
        Post post = postRepository.findByTitle(title);
        if (post == null) {
            return ResponseObject.builder().status(HttpStatus.NOT_FOUND).mess("Post not found").build();
        }
        var isFavorite = userService.isPostFavorite(email, post);
        var postDTO = transformPostDTO(post);
        postDTO.setFavorite(isFavorite);
        return ResponseObject.builder().status(HttpStatus.OK).content(postDTO).build();
    }

    public PostDTO transformPostDTO(Post post) {
        return PostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .email(post.getUser().getEmail())
                .tags(post.getTags())
                .totalComment(post.getTotalComment())
                .content(post.getContent())
                .createAt(post.getDate())
                .userName(post.getUser().getFirstName() + " " + post.getUser().getLastName())
                .thumbnail(post.getThumbnail())
                .userAvatar(post.getUser().getAvatar())
                .status(post.getStatus())
                .build();
    }

    public ResponseObject getPosts(int page, int size){
        var pagePost = postRepository.findAllByIsDeletedAndStatus(false, PostStatus.APPROVED, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date")));
        PagePostDTO pagePostDTO = PagePostDTO.builder()
                .posts(pagePost.getContent().stream().map(this::transformPostDTO).toList())
                .totalPage(pagePost.getTotalPages())
                .totalElement(pagePost.getTotalElements())
                .build();
        return ResponseObject.builder().status(HttpStatus.OK).content(pagePostDTO).build();
    }

    public void savePost(User user, PostDTO postDTO) {
        Post post = Post.builder()
                .date(LocalDateTime.now())
                .title(postDTO.getTitle())
                .content(postDTO.getContent())
                .user(user)
                .build();
        postRepository.save(post);
    }


    public ResponseObject uploadImg(MultipartFile file) {
        String path = null;
        try {
            path = cloudService.uploadImage(file.getBytes());

        } catch (IOException ex) {
            System.out.println("uploadImg: " + ex.getMessage());
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Error while upload image").build();
        }
        return ResponseObject.builder().status(HttpStatus.OK).content(path).mess("upload image successfully").build();
    }

}
