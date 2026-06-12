package com.cursodevjava.javaproject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
// Atualizado para permitir especificamente a porta do React (Vite)
@CrossOrigin(origins = "http://localhost:5173") 
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // INJETANDO O MOTOR DE ENVIO DE E-MAILS
    @Autowired
    private JavaMailSender mailSender;

    // ==========================================
    // CLASSES DE REQUEST (DTOs)
    // ==========================================
    public static class CadastroRequest {
        public String nome;
        public String email;
        public String senha;
    }

    public static class LoginRequest {
        public String email;
        public String senha;
    }

    public static class RecoverRequest {
        public String email;
    }

    public static class ResetPasswordRequest {
        public String token;
        public String novaSenha;
    }

    // ==========================================
    // ENDPOINTS DE CADASTRO E LOGIN
    // ==========================================
    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@RequestBody CadastroRequest request) {
        if (request.nome == null || request.email == null || request.senha == null) {
            return ResponseEntity.badRequest().body("Todos os campos são obrigatórios.");
        }

        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(request.email);
        if (usuarioExistente.isPresent()) {
            return ResponseEntity.badRequest().body("Este e-mail já está em uso.");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(request.nome);
        novoUsuario.setEmail(request.email);
        
        // CRIPTOGRAFANDO A SENHA ANTES DE SALVAR
        String senhaCriptografada = passwordEncoder.encode(request.senha);
        novoUsuario.setSenha(senhaCriptografada); 
        
        usuarioRepository.save(novoUsuario);

        return ResponseEntity.ok("Cadastro bem-sucedido! Bem-vindo à Shadow Performance, " + request.nome + "!");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        if (request.email == null || request.senha == null) {
            return ResponseEntity.badRequest().body("Campos obrigatórios faltando.");
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            
            // COMPARANDO A SENHA DIGITADA COM O HASH DO BANCO
            if (passwordEncoder.matches(request.senha, usuario.getSenha())) {
                return ResponseEntity.ok("Login bem-sucedido! Bem-vindo de volta, " + usuario.getNome() + "!");
            }
        }

        return ResponseEntity.status(401).body("Credenciais inválidas.");
    }

    // ==========================================
    // ENDPOINTS DE RECUPERAÇÃO DE SENHA
    // ==========================================
    @PostMapping("/recuperar-senha")
    public ResponseEntity<String> recuperarSenha(@RequestBody RecoverRequest request) {
        if (request.email == null || request.email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("O e-mail é obrigatório.");
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.email);
        
        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.status(404).body("Este e-mail não está cadastrado na nossa garagem.");
        }

        Usuario usuario = usuarioOpt.get();

        // Gerando Token único (UUID) e validade de 1 hora
        String token = UUID.randomUUID().toString();
        usuario.setTokenRecuperacao(token);
        usuario.setTokenExpiracao(LocalDateTime.now().plusHours(1));
        usuarioRepository.save(usuario);

        // ATUALIZADO: Link que apontará para a tela no novo Front-end (React)
        String linkRedefinicao = "http://localhost:5173/reset?token=" + token;

        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo(usuario.getEmail());
            email.setSubject("🏁 Shadow Performance - Recuperação de Senha");
            email.setText("Olá, " + usuario.getNome() + "!\n\n" +
                          "Recebemos um pedido para redefinir a senha da sua conta no Shadow Performance.\n" +
                          "Clique no link seguro abaixo para criar uma nova senha (válido por 1 hora):\n\n" +
                          linkRedefinicao + "\n\n" +
                          "Se não foi você que solicitou, ignore este e-mail.\n" +
                          "Acelere com segurança!\n" +
                          "Equipe Shadow Performance.");

            mailSender.send(email);
            return ResponseEntity.ok("Link de recuperação gerado com sucesso!");

        } catch (Exception e) {
            System.out.println("Erro ao enviar email: " + e.getMessage());
            return ResponseEntity.status(500).body("Erro interno ao tentar disparar o e-mail de recuperação.");
        }
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<String> redefinirSenha(@RequestBody ResetPasswordRequest request) {
        if (request.token == null || request.novaSenha == null) {
            return ResponseEntity.badRequest().body("Dados incompletos para a redefinição.");
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByTokenRecuperacao(request.token);

        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.status(400).body("Token de recuperação inválido ou inexistente.");
        }

        Usuario usuario = usuarioOpt.get();

        // Verifica se o Token expirou
        if (usuario.getTokenExpiracao().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body("Este link de recuperação já expirou. Solicite um novo.");
        }

        // Criptografa a nova senha com BCrypt antes de salvar
        String senhaCriptografada = passwordEncoder.encode(request.novaSenha);
        usuario.setSenha(senhaCriptografada);

        // Invalida o token após o uso
        usuario.setTokenRecuperacao(null);
        usuario.setTokenExpiracao(null);
        
        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Senha atualizada com sucesso! Pode voltar à garagem e fazer o login.");
    }
}