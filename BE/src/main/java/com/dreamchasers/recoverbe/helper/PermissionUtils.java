package com.dreamchasers.recoverbe.helper;

import com.dreamchasers.recoverbe.entity.User.User;
import com.dreamchasers.recoverbe.exception.PermissionDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Objects;

public class PermissionUtils {
    public static void checkPermission(String email) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!Objects.equals(currentUser.getEmail(), email)) {
            throw new PermissionDeniedException("You don't have permission to access this resource");
        }
    }

}
