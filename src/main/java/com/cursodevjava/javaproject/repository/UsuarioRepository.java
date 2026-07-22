package com.cursodevjava.javaproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cursodevjava.javaproject.model.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByTokenRecuperacao(String token);
}

