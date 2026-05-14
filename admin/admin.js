
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificar se o usuário está logado
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Carregar Leads
    loadLeads();
});

async function loadLeads() {
    const { data: leads, error } = await window.supabaseClient
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao carregar leads:', error);
        return;
    }

    renderLeads(leads);
    updateStats(leads);
}

function renderLeads(leads) {
    const tbody = document.getElementById('leadsTableBody');
    tbody.innerHTML = '';

    leads.forEach(lead => {
        const date = new Date(lead.created_at).toLocaleDateString('pt-BR');
        const phone = lead.telefone || lead.whatsapp || 'N/A';
        const cleanPhone = phone.replace(/\D/g, ''); // Remove caracteres não numéricos
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${date}</td>
            <td>${lead.nome || 'N/A'}</td>
            <td>
                ${phone}
                ${cleanPhone ? `
                <a href="https://wa.me/55${cleanPhone.length <= 11 ? cleanPhone : cleanPhone.slice(-11)}" target="_blank" class="whatsapp-btn" title="Chamar no WhatsApp">
                    <i class="fab fa-whatsapp"></i>
                </a>` : ''}
            </td>
            <td>${lead.clinica || 'N/A'}</td>
            <td>${lead.especialidade || 'N/A'}</td>
            <td style="color: #FFD700; font-weight: bold;">${lead.faturamento || 'N/A'}</td>
            <td><span class="badge badge-${lead.status || 'novo'}">${(lead.status || 'novo').toUpperCase()}</span></td>
            <td>
                <select onchange="updateStatus('${lead.id}', this.value)" style="background: #222; color: white; border: 1px solid #444; border-radius: 4px; padding: 5px;">
                    <option value="novo" ${lead.status === 'novo' ? 'selected' : ''}>Novo</option>
                    <option value="em_contato" ${lead.status === 'em_contato' ? 'selected' : ''}>Em Contato</option>
                    <option value="agendado" ${lead.status === 'agendado' ? 'selected' : ''}>Agendado</option>
                    <option value="convertido" ${lead.status === 'convertido' ? 'selected' : ''}>Convertido</option>
                    <option value="perdido" ${lead.status === 'perdido' ? 'selected' : ''}>Perdido</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateStatus(leadId, newStatus) {
    const { error } = await window.supabaseClient
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

    if (error) {
        alert('Erro ao atualizar status');
    } else {
        loadLeads(); // Recarregar estatísticas e tabela
    }
}

function updateStats(leads) {
    document.getElementById('totalLeads').innerText = leads.length;
    
    const today = new Date().toLocaleDateString('pt-BR');
    const todayLeads = leads.filter(l => new Date(l.created_at).toLocaleDateString('pt-BR') === today).length;
    document.getElementById('newLeads').innerText = todayLeads;

    const converted = leads.filter(l => l.status === 'convertido').length;
    document.getElementById('convertedLeads').innerText = converted;
}

async function logout() {
    await window.supabaseClient.auth.signOut();
    window.location.href = 'login.html';
}
