<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Restablecer contraseña</title>
</head>

<body style="background-color: #ffffff; font-family: 'Instrument Sans', sans-serif; color: #252525; padding: 2rem;">
    <table width="100%" style="max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
            <td style="text-align: center;">
                <h1 style="font-size: 24px; margin-bottom: 1rem;">🔐 ¡Hola {{ $usuario }}!</h1>
                <p style="font-size: 16px; margin-bottom: 2rem;">
                    Hemos recibido una solicitud para restablecer tu contraseña en <strong>Foko</strong>. Si fuiste tú,
                    haz clic en el botón de abajo.
                </p>

                <a href="{{ $url }}"
                    style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                    Restablecer contraseña
                </a>

                <p style="font-size: 14px; color: #666; margin-top: 2rem;">
                    Si no solicitaste un cambio de contraseña, puedes ignorar este mensaje.
                </p>

                <hr style="margin: 2rem 0; border: none; border-top: 1px solid #eee;">

                <p style="font-size: 13px; color: #999;">
                    Si tienes problemas al hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:<br>
                    <a href="{{ $url }}" style="color: #1d4ed8;">{{ $url }}</a>
                </p>

                <p style="font-size: 13px; color: #999; margin-top: 2rem;">— El equipo de Foko</p>
            </td>
        </tr>
    </table>
</body>

</html>
