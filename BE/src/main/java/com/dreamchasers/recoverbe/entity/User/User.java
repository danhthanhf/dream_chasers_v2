package com.dreamchasers.recoverbe.entity.User;

import com.dreamchasers.recoverbe.enums.UserStatus;
import com.dreamchasers.recoverbe.helper.Model.BaseModel;

import com.dreamchasers.recoverbe.entity.post.Post;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User extends BaseModel implements UserDetails {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    @Column(columnDefinition = "TEXT")
    private String bio;
    private String phoneNumber;
    @Value("{${dreamChasers.avatar}")
    private String avatarUrl;
    private String resetCode;
    private String accessToken;
    private boolean isInstructor;

    private UserStatus status;
    private LocalDateTime lastOnline;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnore
    private List<User> friends = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role;


    @ManyToMany(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JsonBackReference
    private List<Post> favoritePosts = new ArrayList<>();

    public String getFullName() {
        return firstName + " " + lastName;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
