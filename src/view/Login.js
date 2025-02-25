class LoginView extends View {
  constructor(parentNode) {
    super(parentNode);
  }

  template() {
    return `
    <!-- Modal de Upload de Banco de Dados -->
    <div class="modal fade" id="configModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Carregar banco de dados</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="database-upload-modal-input" class="form-label">Selecione o arquivo do banco de dados</label>
              <input class="form-control" type="file" id="database-upload-modal-input" accept=".db, .sqlite, .json, application/vnd.sqlite3, application/octet-stream, application/json">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" id="confirmUpload" class="btn btn-primary">Carregar</button>
          </div>
        </div>
      </div>
    </div>

    <main class="container-fluid d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div class="container w-75 border border-3 border-light rounded p-4 bg-light">
        <form id="form-login">
          <h2 class="fs-1 mb-3 text-center">Login</h2>
          <div class="mb-3">
            <label for="username-login-input" class="form-label">Usuário</label>
            <input type="text" class="form-control" id="username-login-input" />
          </div>
          <div class="mb-3">
            <label for="password-login-input" class="form-label">Senha</label>
            <input type="password" class="form-control" id="password-login-input" />
          </div>
          <div class="d-flex flex-row">
            <button type="submit" id="login-submit" class="w-50 btn btn-primary m-1">Entrar</button>
            <button type="button" id="register-input" class="w-50 btn btn-secondary m-1">Cadastrar</button>
          </div>
          <div class="mt-3 text-center">
            <a href="#" id="settings-upload-link" class="text-decoration-none">Configurações</a>
          </div>
        </form>
      </div>
    </main>
    `;
  }
}
