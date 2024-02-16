export const WelcomePatientHtmlText = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Boas Vindas à Hausey</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: rgb(241 245 249);
            color: rgb(36 46 73 1);
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 60px;
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0 0 6px rgba(36, 46, 73, 0.1);
        }
        h2 {
            font-weight: 700;
            font-size: 1.875rem;
            color: rgb(36 46 73);
        }
        li {
            font-size: 1rem;
        }
        blockquote {
            background-color: rgb(231, 241, 252);
            padding-inline: 20px;
            padding-block: 10px;
        }
        li strong {
            color: rgb(37 99 235);
        }
        blockquote p {
            font-size: 1rem;
            font-style: italic;
        }
        .image {
            width: 230px;
            align-self: center;
            margin-inline: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <img
          class="image"
          src="https://hausey.net/wp-content/uploads/2023/07/Logo_hausey_s-tag_PNG-768x266.png"
          alt="Your Company"
        />
        <h2>Boas Vindas à Hausey - Seu Caminho Personalizado para o Bem-Estar!</h2>
        <p>Estamos verdadeiramente animados por te ter como parte de nossa plataforma centrada na saúde e mal podemos esperar para guiá-lo em direção a uma vida mais saudável e feliz.</p>

        <p><strong>Vamos começar sua jornada Hausey com alguns passos essenciais:</strong></p>
        <ol>
            <li><strong>Programa Cuidando de Você:</strong> Ao entrar no aplicativo Hausey, você ganhou acesso a um mundo de cuidados personalizados. Sua assinatura mensal desbloqueia uma equipe de profissionais - médicos, nutricionistas, psicólogos e treinadores pessoais - todos trabalhando harmoniosamente para criar um plano de cuidados sob medida para você.</li>
            <li><strong>Agende suas Consultas de Bem-Estar:</strong> Acesse suas consultas periódicas com nossos médicos especialistas, garantindo que sua saúde seja constantemente monitorada e aprimorada. Acompanhe seu progresso, receba insights valiosos e descubra quais passos você pode tomar para melhorar seu bem-estar.</li>
            <li><strong>Consulta de Emergência 24/7:</strong> Entendemos que preocupações com a saúde podem surgir a qualquer hora. Descanse sabendo que nosso serviço de consulta de emergência 24 horas está aqui para você. Sua saúde é nossa prioridade máxima, e estamos prontos para ajudar sempre que precisar.</li>
            <li><strong>Serviços Missionários:</strong> Ao assinar o Hausey Health, você não está apenas investindo em seu próprio bem-estar; você também está contribuindo para nossa missão de espalhar amor e cuidado. Nossas raízes estão em uma perspectiva cristã, com o objetivo de compartilhar o evangelho globalmente, oferecendo serviços de saúde de alta qualidade.</li>
            <li><strong>Sua Contribuição Faz a Diferença:</strong> Sua assinatura apoia diretamente nossa missão e nos ajuda a estender nossos serviços para aqueles que precisam. Juntos, estamos fazendo um impacto positivo em indivíduos e comunidades em todo o mundo.</li>
        </ol>

        <blockquote>
            <p>O nome <strong>"Hausey"</strong>  é mais do que apenas uma marca; é um anagrama de <strong>'Yeshua'</strong>, o nome hebraico para Jesus. </p>
            <p>Nossa empresa nasceu de uma perspectiva cristã, e nossa missão é poder evangelizar os quatro cantos da terra à medida que entregamos serviços de saúde de alta qualidade.</p>

        </blockquote>

        <p>Se tiver alguma dúvida, pensamento ou apenas quiser se conectar, sinta-se à vontade para entrar em contato com nossa equipe de suporte em <a href="mailto:suporte@hausey.net">suporte@hausey.net</a>.</p>

        <p>Aqui começa a sua jornada rumo a uma vida mais saudável e satisfatória com a Hausey!</p>
    </div>
</body>
</html>
`;
export const WelcomeRepresentantHtmlText = (
  login: string,
  password: string,
) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Boas Vindas à Hausey</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: rgb(241 245 249);
            color: rgb(36 46 73 1);
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 60px;
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0 0 6px rgba(36, 46, 73, 0.1);
        }
        h2 {
            font-weight: 700;
            font-size: 1.875rem;
            color: rgb(36 46 73);
        }
        li {
            font-size: 1rem;
        }
        blockquote {
            background-color: rgb(231, 241, 252);
            padding-inline: 20px;
            padding-block: 10px;
        }
        li strong {
            color: rgb(37 99 235);
        }
        blockquote p {
            font-size: 1rem;
            font-style: italic;
        }
        .image {
            width: 230px;
            align-self: center;
            margin-inline: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <img
          class="image"
          src="https://hausey.net/wp-content/uploads/2023/07/Logo_hausey_s-tag_PNG-768x266.png"
          alt="Your Company"
        />
        <h2>Boas Vindas à Hausey!</h2>
        <p>Estamos verdadeiramente animados por te ter como representante de nossa plataforma centrada na saúde e mal podemos esperar para te ver obtendo resultados incríveis conosco.</p>

        <p><strong>Vamos começar sua jornada Hausey com alguns passos essenciais:</strong></p>
        <ol>
            <li><strong>Acesse a plataforma:</strong> <a href="https://hausey.com.br/comercial/login" target="_blank">Acesse o site</a> e preencha as suas credenciais para fazer o login.</li>
        </ol>

        <blockquote>
            <p>Login: <strong>${login}</strong> </p>
            <p>Senha: <strong>${password}</strong></p>
        </blockquote>

        <p>Se tiver alguma dúvida, pensamento ou apenas quiser se conectar, sinta-se à vontade para entrar em contato com nossa equipe de suporte em <a href="mailto:suporte@hausey.net">suporte@hausey.net</a>.</p>

        <p>Aqui começa a sua jornada. É um prazer imenso ter você conosco!</p>
    </div>
</body>
</html>
`;

export const WelcomeProfessionalHtmlText = (
  login: string,
  password: string,
) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Boas Vindas à Hausey</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: rgb(241 245 249);
            color: rgb(36 46 73 1);
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 60px;
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0 0 6px rgba(36, 46, 73, 0.1);
        }
        h2 {
            font-weight: 700;
            font-size: 1.875rem;
            color: rgb(36 46 73);
        }
        li {
            font-size: 1rem;
        }
        blockquote {
            background-color: rgb(231, 241, 252);
            padding-inline: 20px;
            padding-block: 10px;
        }
        li strong {
            color: rgb(37 99 235);
        }
        blockquote p {
            font-size: 1rem;
            font-style: italic;
        }
        .image {
            width: 230px;
            align-self: center;
            margin-inline: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <img
          class="image"
          src="https://hausey.net/wp-content/uploads/2023/07/Logo_hausey_s-tag_PNG-768x266.png"
          alt="Your Company"
        />
        <h2>Boas Vindas à Hausey!</h2>
        <p>Seu cadastro de acesso foi realizado com sucesso pela equipe admin. Agora você já pode acessar a plataforma. Siga as instruções abaixo:</p>

        <ol>
            <li><strong>Acesse a plataforma:</strong> <a href="https://hausey.com.br/doctor/login" target="_blank">Acesse o site</a> e preencha as suas credenciais para fazer o login.</li>
        </ol>

        <blockquote>
            <p>Login: <strong>${login}</strong> </p>
            <p>Senha: <strong>${password}</strong></p>
        </blockquote>

        <p>Se tiver alguma dúvida, pensamento ou apenas quiser se conectar, sinta-se à vontade para entrar em contato com nossa equipe de suporte em <a href="mailto:suporte@hausey.net">suporte@hausey.net</a>.</p>

        <p>Aqui começa a sua jornada. É um prazer imenso ter você conosco!</p>
    </div>
</body>
</html>
`;
