package com.gifttracker.dto;

public class AuthResponse {
    
    private String token;
    private String type;
    private Long userId;
    private String username;
    private String nickname;
    
    public static AuthResponse success(String token, Long userId, String username, String nickname) {
        AuthResponse r = new AuthResponse();
        r.token = token;
        r.type = "Bearer";
        r.userId = userId;
        r.username = username;
        r.nickname = nickname;
        return r;
    }
    
    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}
