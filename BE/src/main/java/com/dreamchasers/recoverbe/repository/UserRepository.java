package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.entity.User.Role;
import com.dreamchasers.recoverbe.entity.User.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    Page<User> findAllByDeleted (boolean deleted, org.springframework.data.domain.Pageable pageable);

    Page<User> findAllByDeletedAndRole (boolean deleted, String role, org.springframework.data.domain.Pageable pageable);

    Page<User> findByRoleAndDeleted(Role role, boolean deleted,  org.springframework.data.domain.Pageable pageable);

    Page<User> findByFirstNameContainingOrLastNameContainingOrEmailContainingAndDeletedAndRole(String firstName, String lastName, String email, boolean deleted, Role role, org.springframework.data.domain.Pageable pageable);

    Page<User> findByFirstNameContainingOrLastNameContainingOrEmailContainingAndDeleted(String firstName, String lastName, String email, boolean deleted, org.springframework.data.domain.Pageable pageable);
}
