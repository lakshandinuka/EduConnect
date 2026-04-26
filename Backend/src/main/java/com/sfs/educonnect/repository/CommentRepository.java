package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
