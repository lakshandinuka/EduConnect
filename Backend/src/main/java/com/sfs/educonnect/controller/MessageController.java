package com.sfs.educonnect.controller;

import com.sfs.educonnect.entity.Message;
import com.sfs.educonnect.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @PostMapping
    public Message sendMessage(@RequestBody Message message) {
        message.setReplied(false);
        return messageRepository.save(message);
    }

    @GetMapping
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    @SuppressWarnings("null")
    @PutMapping("/{id}/reply")
    public Message replyToMessage(@PathVariable Long id, @RequestBody String reply) {
        Message message = messageRepository.findById(id).orElseThrow();
        message.setReply(reply);
        message.setReplied(true);
        return messageRepository.save(message);
    }

    @SuppressWarnings("null")
    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable Long id) {
        if (!messageRepository.existsById(id)) {
            throw new RuntimeException("Message not found with id " + id);
        }
        messageRepository.deleteById(id);
    }
}

