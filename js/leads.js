document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[name="Formulario_Qualificacao"]');
    
    // Configuração do WhatsApp (Mude para o seu número se necessário)
    const WHATSAPP_NUMBER = '558999296983';

    if (form) {
        form.addEventListener('submit', async (e) => {
            // Interceptação total do formulário
            e.preventDefault();
            e.stopImmediatePropagation();
            
            // Feedback visual no botão
            const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.elementor-button');
            const btnTextElement = submitBtn.querySelector('.elementor-button-text') || submitBtn;
            const originalBtnText = btnTextElement.innerText;
            
            btnTextElement.innerText = 'ENVIANDO...';
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.7';

            console.log('Capturando lead para o Supabase...');

            const formData = new FormData(form);
            
            // Captura precisa dos campos do Elementor
            const leadData = {
                nome: formData.get('form_fields[name]') || document.getElementById('form-field-name')?.value,
                email: formData.get('form_fields[email]') || document.getElementById('form-field-email')?.value,
                telefone: formData.get('form_fields[field_bb2d15f]') || document.getElementById('form-field-field_bb2d15f')?.value,
                clinica: formData.get('form_fields[field_4169f50]') || document.getElementById('form-field-field_4169f50')?.value,
                especialidade: formData.get('form_fields[field_13a1e79]') || document.getElementById('form-field-field_13a1e79')?.value,
                faturamento: formData.get('form_fields[faturamento]') || document.getElementById('form-field-faturamento')?.value,
                status: 'novo'
            };

            // Capturar UTMs
            const urlParams = new URLSearchParams(window.location.search);
            leadData.utm_source = urlParams.get('utm_source') || 'direto';
            leadData.utm_medium = urlParams.get('utm_medium') || '';
            leadData.utm_campaign = urlParams.get('utm_campaign') || '';

            try {
                // 1. Salva no Banco de Dados (Supabase)
                const { error } = await window.supabaseClient
                    .from('leads')
                    .insert([leadData]);

                if (error) {
                    console.error('Erro ao salvar no banco (mas seguindo para WhatsApp):', error);
                }
            } catch (err) {
                console.error('Erro crítico no Supabase:', err);
            }

            // 2. Sempre redireciona para o WhatsApp, independente do erro no banco
            const msg = encodeURIComponent(`Olá! Me chamo ${leadData.nome}. Acabei de me cadastrar no site e gostaria de mais informações sobre a assessoria.`);
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
            
            // Pequeno delay para garantir que o usuário veja que foi processado
            setTimeout(() => {
                window.location.href = whatsappUrl;
            }, 500);

        }, true); // O 'true' garante que capturemos o evento antes do Elementor
    }
});
