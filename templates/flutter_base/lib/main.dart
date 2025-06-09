import 'package:flutter/material.dart';
import 'screens/homeScreen.dart'; // o el nombre generado dinámicamente

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Proyecto Exportado',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const HomeScreen(), // Carga solo una pantalla
    );
  }
}
