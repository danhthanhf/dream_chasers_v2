package com.example.demo.entity.user;

import com.example.demo.config.GrantedAuthorityDeserializer;
import com.example.demo.entity.data.*;
import com.example.demo.jwt.Token;
import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String avatar;
    private String phoneNumber;
    private boolean isDeleted = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    @OneToOne
    @JoinColumn(name = "token_id")
    private Token token;

    @ElementCollection
    @CollectionTable(name = "code_table", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "code")
    @Column(name = "expiration")
    private Map<String, LocalDateTime> code = new HashMap<String, LocalDateTime>();

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user",cascade = CascadeType.REMOVE)
    private List<Comment> comments;

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JsonBackReference
    private List<Post> favoritePosts = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    List<Progress> progresses = new ArrayList<>();

    @PrePersist
    protected  void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Override
    @JsonDeserialize(using = GrantedAuthorityDeserializer.class)
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
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
