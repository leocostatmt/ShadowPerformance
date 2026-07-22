package com.cursodevjava.javaproject.controller;

import com.cursodevjava.javaproject.model.Produto;
import com.cursodevjava.javaproject.repository.ProdutoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*") // Libera acesso para o Front-end
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    // Rota GET: Retorna a lista de produtos (O que o seu React vai chamar)
    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        List<Produto> produtos = produtoRepository.findAll();
        return ResponseEntity.ok(produtos);
    }

    // Rota POST: Para você adicionar produtos futuramente via Postman/Insomnia
    @PostMapping
    public ResponseEntity<Produto> adicionarProduto(@RequestBody Produto produto) {
        Produto novoProduto = produtoRepository.save(produto);
        return ResponseEntity.status(201).body(novoProduto);
    }
}