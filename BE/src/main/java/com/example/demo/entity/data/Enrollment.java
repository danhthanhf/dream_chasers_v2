package com.example.demo.entity.data;

import com.example.demo.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int progress;
    private boolean isCompleted;

    @ManyToOne (cascade = CascadeType.PERSIST)
    @JsonIgnore
    private Course course;

    @ManyToOne (cascade = CascadeType.PERSIST)
    @JsonIgnore
    private User user;

    @ManyToMany(cascade = CascadeType.PERSIST)
    private List<Progress> progressList = new ArrayList<>();

}
