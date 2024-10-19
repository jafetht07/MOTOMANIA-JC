function sendMessage(motoModel) {
    const phoneNumber = "50689354332"; // Código de país sin el símbolo + ni espacios
    
    // Preguntar si desea comprar con financiamiento o al contado
    const formaPago = prompt("¿Desea llevar la motocicleta con financiamiento o al contado? Escriba 'financiamiento' o 'contado':").toLowerCase().trim();
    
    let message = `Hola Jafeth, estoy interesado en el modelo ${motoModel}. Me gustaría obtener más información.`;
    
    if (formaPago === 'financiamiento') {
        // Si selecciona financiamiento, solicitar la cédula
        const cedula = prompt("Usted ha elegido financiamiento. Por favor, ingrese su número de cédula para realizar un pre analísis previo:");
        message += `\nHe elegido la opción de pago con financiamiento. Mi número de cédula es ${cedula}.`;
    } else if (formaPago === 'contado') {
        // Si selecciona contado, continuar con el mensaje original
        message += `\nHe elegido la opción de pago al contado.`;
    } else {
        alert("Opción no válida. Intente nuevamente.");
        return; // Salir de la función si la opción no es válida
    }
    
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp con el mensaje
    window.open(url, '_blank');
}




