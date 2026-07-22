package com.cursodevjava.javaproject.config;

import com.cursodevjava.javaproject.model.Produto;
import com.cursodevjava.javaproject.repository.ProdutoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;

@Configuration
public class TestConfig implements CommandLineRunner {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Override
    public void run(String... args) throws Exception {
        if (produtoRepository.count() == 0) {
            Produto p1 = new Produto(
                "Kit Embreagem Cerâmica 400whp", 
                "SHADOW", 
                new BigDecimal("1850.00"), 
                new BigDecimal("2100.00"), 
                "src/assets/images/embreagem.jpg", 
                true
            );
            
            Produto p2 = new Produto(
                "Jogo de Rodas Civic Si 2007 Aro 17", 
                "HONDA OEM", 
                new BigDecimal("3500.00"), 
                null, 
                "src/assets/images/rodas.png", 
                false
            );
            
            Produto p3 = new Produto(
                "Projetores LED H4 Alta Intensidade", 
                "LUMEN", 
                new BigDecimal("450.00"), 
                new BigDecimal("580.00"), 
                "src/assets/images/lampada.jpg", 
                true
            );
            
            Produto p4 = new Produto(
                "Abafador Inox RCI 5 Polegadas", 
                "SHADOW", 
                new BigDecimal("850.00"), 
                null, 
                "src/assets/images/abafador.jpg", 
                false
            );

            produtoRepository.saveAll(Arrays.asList(p1, p2, p3, p4));
            System.out.println("✅ Produtos inseridos no banco com sucesso!");
        }
    }
}