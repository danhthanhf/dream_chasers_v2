package com.example.demo.repository.data;

import com.example.demo.dto.ProgressDTO;
import com.example.demo.entity.data.Progress;
import com.example.demo.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Integer> {
    Optional<Progress> findByCourseIdAndUser(int courseId, User user);

//    @Query("SELECT new com.example.demo.dto.ProgressDTO(p.course) FROM Progress p WHERE p.user.email = :email")
//    List<ProgressDTO> findAllDTOByUserEmail(@Param("email") String email);
}
