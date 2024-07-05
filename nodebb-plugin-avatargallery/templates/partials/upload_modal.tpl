<div class="row">
    <div class="col-md-6">
        <div class="form-group">
            <label for="avatar-file-input">Choose Image</label>
            <input type="file" id="avatar-file-input" class="form-control" accept="image/*">
        </div>
        <div class="form-group">
            <label for="avatar-name">Avatar Name</label>
            <input type="text" id="avatar-name" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="avatar-access">Access Level</label>
            <select id="avatar-access" class="form-control" required>
                <option value="users">All Users</option>
                <option value="moderators">Moderators & Above</option>
                <option value="global_moderators">Global Moderators & Administrators</option>
                <option value="administrators">Administrators Only</option>
            </select>
        </div>
    </div>
    <div class="col-md-6">
        <img id="avatar-preview" src="" alt="Avatar Preview" style="max-width: 100%; height: auto;">
    </div>
</div>