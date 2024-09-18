package com.example.demo.repository;

import com.example.demo.dto.UserStatisticDTO;
import com.example.demo.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);

    @Query(value = "select * from user where role = :role", nativeQuery = true)
    Page<User> findByRole(String role, Pageable pageable);

    @Query(value = "select u from User u where (u.firstName like %?1% or u.lastName like %?2%) and u.isDeleted = ?3")
    Page<User> findByFirstNameContainingOrLastNameContainingAndAndDeleted(String firstName, String lastName, boolean isDelete, Pageable pageable);

    Page<User> findAllByIsDeleted(boolean isDeleted, Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE MONTH(u.createdAt) = :month AND YEAR(u.createdAt) = :year")
    int countUsersRegisteredInMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT NEW com.example.demo.dto.UserStatisticDTO(u.id, u.email, u.firstName, u.lastName, u.avatar) FROM User u WHERE MONTH(u.createdAt) = :month AND YEAR(u.createdAt) = :year")
    Page<UserStatisticDTO> findUsersRegisteredInMonth(@Param("month") int month, @Param("year") int year, Pageable pageable);

}
