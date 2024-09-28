package com.dreamchasers.recoverbe.repository;

import com.dreamchasers.recoverbe.model.User.Role;
import com.dreamchasers.recoverbe.model.User.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByAccessToken(String token);
    Page<User> findAllByDeleted (boolean deleted, org.springframework.data.domain.Pageable pageable);

    Page<User> findByRole(Role role, org.springframework.data.domain.Pageable pageable);

    Page<User> findByFirstNameContainingAndLastNameContainingAndDeleted(String firstName, String lastName, boolean deleted, org.springframework.data.domain.Pageable pageable);
}
