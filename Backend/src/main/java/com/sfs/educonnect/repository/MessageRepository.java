package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Get all messages sent by students
    List<Message> findBySender(String sender);

    // Get only messages that are not replied yet
    List<Message> findByRepliedFalse();
}

