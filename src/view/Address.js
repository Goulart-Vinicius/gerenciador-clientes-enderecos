class AddressView extends View {
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
      <nav class="navbar navbar-expand-lg navbar-light bg-light fixed">
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
      <div class="container">
        <div class="register-address">
          <h2 class="fs-1 mb-3">Cadastro de Endereços</h2>
          <form id="address-form">
            <div class="row g-3 mb-3">
              <div class="col-md-3">
                <label for="zipCode" class="form-label">CEP</label>
                <input type="text" class="form-control" id="zipCode" required>
              </div>
              <div class="col-md-6">
                <label for="street" class="form-label">Rua</label>
                <input type="text" class="form-control" id="street" required>
              </div>
              <div class="col-md-3">
                <label for="neighborhood" class="form-label">Bairro</label>
                <input type="text" class="form-control" id="neighborhood" required>
              </div>
              <div class="col-md-4">
                <label for="city" class="form-label">Cidade</label>
                <input type="text" class="form-control" id="city" required>
              </div>
              <div class="col-md-4">
                <label for="state" class="form-label">Estado</label>
                <input type="text" class="form-control" id="state" required>
              </div>
              <div class="col-md-4">
                <label for="country" class="form-label">País</label>
                <input type="text" class="form-control" id="country" required>
              </div>
              <div class="col-12">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="is-main">
                  <label class="form-check-label" for="is-main">Endereço Principal</label>
                </div>
              </div>
              <div class="col-12">
                <button type="submit" id="register_submit" class="btn btn-primary">Cadastrar</button>
                <button type="button" id="update_submit" class="btn btn-success d-none">Atualizar</button>
                <button type="button" id="cancel_register" class="btn btn-secondary">Cancelar</button>
              </div>
            </div>
          </form>
        </div>
        <h3 class="fs-1 mb-2">Lista de Endereços</h3>
        <div class="table-responsive list-address mb-3">
          <table class="table table-striped" id="address-table">
            <thead>
              <tr>
              <th>CEP</th>
              <th>Rua</th>
              <th>Bairro</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>País</th>
              <th>Principal</th>
              </tr>
            </thead>
            <tbody id="address-list">
              <!-- Lista será preenchida via JavaScript -->
            </tbody>
          </table>
        </div>

      </div>
    `;
  }
}
