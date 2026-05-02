package com.sfs.educonnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // 🔥 THIS enables auto escalation
public class EduconnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(EduconnectApplication.class, args);
    }

}