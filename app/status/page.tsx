import { InfoCard, InstitutionalPage } from "../institutional-page";
export const dynamic="force-dynamic";
export default function StatusPage(){return <InstitutionalPage title="Status do serviço" lead="Visão pública e transparente do funcionamento do FLANTO.">
  <InfoCard title="Operação"><p>🟢 Página institucional e central de informações operacionais.</p></InfoCard>
  <InfoCard title="Avisos"><p>Incidentes, manutenções programadas e atualizações relevantes serão comunicados nos canais oficiais. Se um comando não responder, aguarde alguns minutos antes de tentar novamente.</p></InfoCard>
  <InfoCard title="Precisa de ajuda?"><p>Consulte a página de <a href="/suporte">suporte</a> para relatar um problema com seu grupo ou conta.</p></InfoCard>
</InstitutionalPage>}
