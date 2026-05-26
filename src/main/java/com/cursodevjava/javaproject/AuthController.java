package com.cursodevjava.javaproject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // INJETANDO O ENCODER AQUI
    @Autowired
    private PasswordEncoder passwordEncoder;

    public static class CadastroRequest {
        public String nome;
        public String email;
        public String senha;
    }

    public static class LoginRequest {
        public String email;
        public String senha;
    }

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
        
        // ==========================================
        // CRIPTOGRAFANDO A SENHA ANTES DE SALVAR
        // ==========================================
        String senhaCriptografada = passwordEncoder.encode(request.senha);
        novoUsuario.setSenha(senhaCriptografada); 
        
        usuarioRepository.save(novoUsuario);

        return ResponseEntity.ok("Cadastro bem-sucedido! Bem-vindo á Shadow Performance, " + request.nome + "!");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        if (request.email == null || request.senha == null) {
            return ResponseEntity.badRequest().body("Campos obrigatórios faltando.");
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            
            // ==========================================
            // COMPARANDO A SENHA DIGITADA COM O HASH DO BANCO
            // ==========================================
            if (passwordEncoder.matches(request.senha, usuario.getSenha())) {
                return ResponseEntity.ok("Login bem-sucedido! Bem-vindo de volta, " + usuario.getNome() + "!");
            }
        }

        return ResponseEntity.status(401).body("Credenciais inválidas.");
    }
}