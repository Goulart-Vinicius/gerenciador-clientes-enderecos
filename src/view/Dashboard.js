class DashboardView extends View {
  constructor(parentNode) {
    super(parentNode);
  }

  template() {
    return `
    <!-- Modal de Confirmação de Exclusão -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Exclusão</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Tem certeza que deseja excluir este cliente?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" id="confirmDelete" class="btn btn-danger">Excluir</button>
          </div>
        </div>
      </div>
    </div>

    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" id="navbar-dashboard-link" href="#">Clientes</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="navbar-address-link" href="#">Endereços</a>
            </li>
          </ul>
          <div class="m-2">
            <button id="export-json" class="btn btn-success">Exportar para JSON</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="container mt-5" id="client-container">
      <h2 class="mb-4 fs-1">Cadastro de Clientes</h2>

      <!-- Formulário de Cadastro -->
      <form id="client-form" class="mb-5">
          <div class="row g-3">
              <div class="col-md-6">
                  <label for="fullname" class="form-label">Nome Completo</label>
                  <input type="text" class="form-control" id="fullname" required>
              </div>

              <div class="col-md-6">
                  <label for="cpf" class="form-label">CPF</label>
                  <input type="text" class="form-control" id="cpf" required>
              </div>

              <div class="col-md-4">
                  <label for="birthdate" class="form-label">Data de Nascimento</label>
                  <input type="date" class="form-control" id="birthdate" required>
              </div>

              <div class="col-md-4">
                  <label for="phone" class="form-label">Telefone</label>
                  <input type="tel" class="form-control" id="phone" required>
              </div>

              <div class="col-md-4">
                  <label for="mobile" class="form-label">Celular</label>
                  <input type="tel" class="form-control" id="mobile" required>
              </div>

              <div class="col-12">
                <button type="submit" id="register_submit" class="btn btn-primary">Cadastrar</button>
                <button type="button" id="update_submit" class="btn btn-success d-none">Atualizar</button>
                <button type="button" id="cancel_register" class="btn btn-secondary">Cancelar</button>
              </div>
          </div>
      </form>

      <!-- Listagem de Clientes -->
      <div class="table-responsive">
          <table class="table table-striped" id="clients-table">
              <thead>
                  <tr>
                      <th>Nome</th>
                      <th>CPF</th>
                      <th>Nascimento</th>
                      <th>Telefone</th>
                      <th>Celular</th>
                  </tr>
              </thead>
              <tbody id="clients-list">
                  <!-- Lista será preenchida via JavaScript -->
              </tbody>
          </table>
      </div>
    </div>`;
  }
}
