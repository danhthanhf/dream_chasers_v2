package com.dreamchasers.recoverbe.controller.Private;

import com.dreamchasers.recoverbe.dto.StatusChangeDTO;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/private/post")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PutMapping("/{id}/status")
    public ResponseEntity<ResponseObject> changeCourseStatus(@PathVariable UUID id, @RequestBody StatusChangeDTO statusChangeDTO) {
        ResponseObject result = postService.adminChangeStatus(id, statusChangeDTO);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "5") int size,
                                                 @RequestParam(defaultValue = "ALL") String status) {
        var result = postService.getAllByStatus(status, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping
    public ResponseEntity<ResponseObject> searchPost(@RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "5") int size,
                                                     @RequestParam(defaultValue = "APPROVED") String status,
                                                     @RequestParam String title) {
        var result = postService.getAllByStatusAndTitle(title, status, page, size);

        return ResponseEntity.status(result.getStatus()).body(result);
    }

}
