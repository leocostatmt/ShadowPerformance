package com.cursodevjava.javaproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class JavaprojectApplication {

	public static void main(String[] args) {
		SpringApplication.run(JavaprojectApplication.class, args);

		int a = 10;
		double b = 20.5;
		String c = "Hello, World!";
		System.out.println("Integer: " + a);
		System.out.println("Double: " + b);
		System.out.println("String: " + c);

	}

}
