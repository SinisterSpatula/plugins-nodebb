<form id="avatar-details-form">
  <div class="mb-3">
    <label for="avatar-name" class="form-label">Avatar Name</label>
    <input type="text" class="form-control" id="avatar-name" required>
  </div>
  <div class="mb-3">
    <label for="avatar-access" class="form-label">Access Level</label>
    <select class="form-select" id="avatar-access" required>
      <option value="users">All Users</option>
      <option value="moderators">Moderators & Above</option>
      <option value="global_moderators">Global Moderators & Administrators</option>
      <option value="administrators">Administrators Only</option>
    </select>
  </div>
</form>