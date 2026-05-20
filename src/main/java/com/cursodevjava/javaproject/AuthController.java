package com.cursodevjava.javaproject;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // Diz ao Spring que esta classe responde a requisições Web
@RequestMapping("/api") // Prefixo para todas as rotas (ex: localhost:8080/api/login)
@CrossOrigin(origins = "*") // SUPER IMPORTANTE: Permite que seu HTML local acesse o Java sem dar erro de CORS
public class AuthController {

    // 1. DTO (Data Transfer Object) para receber os dados do Cadastro do Front-end
    public static class CadastroRequest {
        public String nome;
        public String email;
        public String senha;
    }

    // ROTA DE CADASTRO
    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@RequestBody CadastroRequest request) {
        // Valida se veio algo vazio
        if (request.nome == null || request.email == null || request.senha == null) {
            return ResponseEntity.badRequest().body("Todos os campos são obrigatórios.");
        }

        // Aqui no futuro você vai salvar no Banco de Dados. 
        // Por enquanto, vamos apenas simular o sucesso e devolver uma resposta HTTP 200 (OK).
        return ResponseEntity.ok("Cadastro bem-sucedido! Bem-vindo, " + request.nome + "!");
    }

    // 2. DTO para receber os dados de Login do Front-end
    public static class LoginRequest {
        public String email;
        public String senha;
    }

    // ROTA DE LOGIN
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        if (request.email == null || request.senha == null) {
            return ResponseEntity.badRequest().body("Campos obrigatórios faltando.");
        }

        // Simulação básica de verificação de login (depois você trocará por uma busca no banco)
        if (request.email.equals("admin@teste.com") && request.senha.equals("Senha123")) {
            return ResponseEntity.ok("Login bem-sucedido!");
        } else {
            // Retorna erro 401 (Não Autorizado) se a senha estiver errada
            return ResponseEntity.status(401).body("Credenciais inválidas.");
        }
    }
}