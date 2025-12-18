import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = "$2a$10$lfQi9jSfhZZhfS7d1JP2/.nLYBqKGLqBVk3qTvuBDKyv9bLVLvPEy";
        String plainPassword = "password";

        boolean matches = encoder.matches(plainPassword, hashedPassword);

        System.out.println("=========================================");
        System.out.println("PASSWORD HASH VERIFICATION TEST");
        System.out.println("=========================================");
        System.out.println("Testing password: " + plainPassword);
        System.out.println("Against hash: " + hashedPassword);
        System.out.println("Matches: " + matches);
        System.out.println("=========================================");

        if (!matches) {
            System.out.println("ERROR: HASH DOES NOT MATCH! The database hash is wrong!");
        } else {
            System.out.println("SUCCESS: The password hash is correct!");
        }
    }
}
