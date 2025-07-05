package com.danhthanhf.distantclass.common.util;

import com.danhthanhf.distantclass.entity.User.User;
import com.danhthanhf.distantclass.exception.PermissionDeniedException;
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
