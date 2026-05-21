package com.cursodevjava.javaproject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Permite a conexão com seu HTML local
public class AuthController {

    // Injeta o repositório para podermos acessar o PostgreSQL
    @Autowired
    private UsuarioRepository usuarioRepository;

    // ==========================================
    // DTOs (Classes para receber dados do Front)
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

    // ==========================================
    // ROTA DE CADASTRO
    // ==========================================
    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@RequestBody CadastroRequest request) {
        // 1. Validação básica
        if (request.nome == null || request.email == null || request.senha == null) {
            return ResponseEntity.badRequest().body("Todos os campos são obrigatórios.");
        }

        // 2. Verifica se o e-mail já existe no banco de dados
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(request.email);
        if (usuarioExistente.isPresent()) {
            return ResponseEntity.badRequest().body("Este e-mail já está em uso.");
        }

        // 3. Prepara a entidade e salva no banco de dados
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(request.nome);
        novoUsuario.setEmail(request.email);
        novoUsuario.setSenha(request.senha); 
        
        // Em um projeto real, criptografaríamos a senha aqui antes de salvar!
        usuarioRepository.save(novoUsuario);

        return ResponseEntity.ok("Cadastro bem-sucedido! Bem-vindo ao Olimpo, " + request.nome + "!");
    }

    // ==========================================
    // ROTA DE LOGIN
    // ==========================================
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        // 1. Validação básica
        if (request.email == null || request.senha == null) {
            return ResponseEntity.badRequest().body("Campos obrigatórios faltando.");
        }

        // 2. Busca o usuário no banco de dados pelo e-mail
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.email);

        // 3. Verifica se encontrou o usuário e se a senha bate
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            
            if (usuario.getSenha().equals(request.senha)) {
                return ResponseEntity.ok("Login bem-sucedido! Bem-vindo de volta, " + usuario.getNome() + "!");
            }
        }

        // Se o e-mail não existir ou a senha estiver errada:
        return ResponseEntity.status(401).body("Credenciais inválidas.");
    }
}