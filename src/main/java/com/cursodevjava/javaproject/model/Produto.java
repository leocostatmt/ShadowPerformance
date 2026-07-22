package com.cursodevjava.javaproject.model;


import jakarta.persistence.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;
    private BigDecimal price;
    private BigDecimal oldPrice;
    private String image;

    // O @JsonProperty garante que o JSON saia exatamente como 'isNew' para o React
    @JsonProperty("isNew")
    @Column(name = "is_new")
    private boolean isNew;

    // Construtor vazio (obrigatório para o JPA)
    public Produto() {
    }

    // Construtor com parâmetros para facilitar a criação
    public Produto(String name, String brand, BigDecimal price, BigDecimal oldPrice, String image, boolean isNew) {
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.oldPrice = oldPrice;
        this.image = image;
        this.isNew = isNew;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getOldPrice() { return oldPrice; }
    public void setOldPrice(BigDecimal oldPrice) { this.oldPrice = oldPrice; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public boolean isNew() { return isNew; }
    public void setNew(boolean isNew) { this.isNew = isNew; }
}

