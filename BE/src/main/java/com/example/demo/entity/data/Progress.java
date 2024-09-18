package com.example.demo.entity.data;

import com.example.demo.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jdk.jshell.spi.ExecutionControl;
import lombok.*;
import org.antlr.v4.runtime.misc.IntegerList;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class  Progress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  int id;
    private boolean isCompleted;
    private int timeStamp;

    @ManyToOne
    @JsonIgnore
    private Enrollment enrollment;

    @ManyToOne
    private Lesson lesson;
}
