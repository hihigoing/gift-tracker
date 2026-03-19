package com.gifttracker.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.gifttracker.dto.AuthResponse;
import com.gifttracker.dto.LoginRequest;
import com.gifttracker.dto.RegisterRequest;
import com.gifttracker.mapper.UserMapper;
import com.gifttracker.model.User;
import com.gifttracker.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public UserService(UserMapper userMapper, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 检查用户名是否已存在
        User existingUser = userMapper.findByUsername(request.getUsername());
        if (existingUser != null) {
            throw new RuntimeException("用户名已存在");
        }
        
        // 创建用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setNickname(request.getNickname() != null ? request.getNickname() : request.getUsername());
        user.setEnabled(true);
        
        userMapper.insert(user);
        
        // 生成 token
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        
        return AuthResponse.success(token, user.getId(), user.getUsername(), user.getNickname());
    }
    
    public AuthResponse login(LoginRequest request) {
        User user = userMapper.findByUsername(request.getUsername());
        
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        if (!user.getEnabled()) {
            throw new RuntimeException("账户已被禁用");
        }
        
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        
        return AuthResponse.success(token, user.getId(), user.getUsername(), user.getNickname());
    }
    
    public User getCurrentUser(Long userId) {
        return userMapper.selectById(userId);
    }
}
