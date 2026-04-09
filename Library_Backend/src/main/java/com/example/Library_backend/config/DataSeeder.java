package com.example.Library_backend.config;

import com.example.Library_backend.entity.User;
import com.example.Library_backend.enums.Role;
import com.example.Library_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Super Admin if not exists
        String adminEmail = "admin@college.edu";
        Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);
        
        if (existingAdmin.isEmpty()) {
            User admin = new User();
            admin.setFullName("Super Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.SUPER_ADMIN);
            admin.setIsActive(true);
            admin.setIsEmailVerified(true);
            
            userRepository.save(admin);
            System.out.println("Default Super Admin seeded successfully: " + adminEmail + " / admin123");
        }

        // Seed Librarian if not exists
        String librarianEmail = "librarian@college.edu";
        Optional<User> existingLibrarian = userRepository.findByEmail(librarianEmail);

        if (existingLibrarian.isEmpty()) {
            User librarian = new User();
            librarian.setFullName("Head Librarian");
            librarian.setEmail(librarianEmail);
            librarian.setPassword(passwordEncoder.encode("librarian123"));
            librarian.setRole(Role.LIBRARIAN);
            librarian.setIsActive(true);
            librarian.setIsEmailVerified(true);
            
            userRepository.save(librarian);
            System.out.println("Default Librarian seeded successfully: " + librarianEmail + " / librarian123");
        }
    }
}
