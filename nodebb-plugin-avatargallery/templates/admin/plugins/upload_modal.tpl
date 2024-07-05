<div class="row">
    <div class="col-md-9">
        <div class="form-group mb-3">
            <label for="avatar-file-input">Choose Image</label>
            <input type="file" id="avatar-file-input" class="form-control" accept="image/*">
        </div>
        <div class="form-group mb-3">
            <label for="avatar-name">Avatar Name</label>
            <input type="text" id="avatar-name" class="form-control" required>
        </div>
        <div class="form-group mb-3">
            <label for="avatar-access">Access Level</label>
            <select id="avatar-access" class="form-control" required style="appearance: auto !important;">
                <option value="users">All Users</option>
                <option value="moderators">Moderators & Above</option>
                <option value="global_moderators">Global Moderators & Administrators</option>
                <option value="administrators">Administrators Only</option>
            </select>
        </div>
    </div>
    <div class="col-md-3 d-flex flex-column justify-content-center">
        <div id="avatar-preview-container" class="border border-2 border-dashed rounded p-3 text-center text-muted d-flex flex-column justify-content-center align-items-center" style="height: 200px;">
            <i class="fa fa-user fa-4x mb-2"></i>
            <p class="mb-0">Preview</p>
        </div>
        <img id="avatar-preview" src="" alt="Avatar Preview" class="img-fluid d-none">
    </div>
</div>
<div id="cropper-container" class="mt-3 d-none">
    <img id="cropper-image" src="" alt="Image to crop" style="max-width: 100%;">
    <div class="d-flex justify-content-center mt-2">
        <div class="btn-group">
            <button class="btn btn-primary rotate" data-degrees="-45"><i class="fa fa-rotate-left"></i></button>
            <button class="btn btn-primary rotate" data-degrees="45"><i class="fa fa-rotate-right"></i></button>
            <button class="btn btn-primary flip" data-option="1" data-method="scaleX"><i class="fa fa-arrows-h"></i></button>
            <button class="btn btn-primary flip" data-option="1" data-method="scaleY"><i class="fa fa-arrows-v"></i></button>
            <button class="btn btn-primary reset">Reset</button>
        </div>
    </div>
</div>
