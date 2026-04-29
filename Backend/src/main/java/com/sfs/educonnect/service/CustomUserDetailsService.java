package com.sfs.educonnect.service;

import com.sfs.educonnect.repository.UserRepository;
import com.sfs.educonnect.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrUsername) throws UsernameNotFoundException {
        return userRepository.findByEmail(emailOrUsername)
                .map(user -> (UserDetails) user)
                .orElseGet(() -> adminRepository.findByUsername(emailOrUsername)
                        .orElseThrow(() -> new UsernameNotFoundException("User/Admin not found with: " + emailOrUsername)));
    }
}
