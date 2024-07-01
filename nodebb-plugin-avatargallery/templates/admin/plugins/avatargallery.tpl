<div class="acp-page-container">
    <!-- IMPORT admin/partials/settings/header.tpl -->

    <div class="row m-0">
        <div id="avatargallery" class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Avatar Gallery</h3>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-lg-6">
                            <button id="add-avatar" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAvatarModal">
                                <i class="fa fa-plus"></i> Add New Avatar
                            </button>
                        </div>
                        <div class="col-lg-6">
                            <input type="text" class="form-control" id="avatar-search" placeholder="Search avatars...">
                        </div>
                    </div>

                    <div id="avatar-container" class="row">
                        <!-- BEGIN avatars -->
                        <div class="col-md-3 col-sm-4 col-6 mb-4">
                            <div class="card avatar-card">
                                <img src="{avatars.path}" class="card-img-top" alt="{avatars.name}">
                                <div class="card-body">
                                    <h5 class="card-title">{avatars.name}</h5>
                                    <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-sm btn-outline-primary rename-avatar" data-id="{avatars.id}">Rename</button>
                                    <button type="button" class="btn btn-sm btn-outline-danger delete-avatar" data-id="{avatars.id}">Delete</button>
                                </div>
                                </div>
                            </div>
                        </div>
                        <!-- END avatars -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Add Avatar Modal -->
<div class="modal fade" id="addAvatarModal" tabindex="-1" role="dialog" aria-labelledby="addAvatarModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header d-flex justify-content-between align-items-center">
                <h5 class="modal-title" id="addAvatarModalLabel">Add New Avatar</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="add-avatar-form">
                    <div class="form-group">
                        <label for="avatar-name">Avatar Name</label>
                        <input type="text" class="form-control" id="avatar-name" required>
                    </div>
                    <div class="form-group">
                        <label for="avatar-file">Avatar Image</label>
                        <input type="file" class="form-control-file" id="avatar-file" accept="image/*" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="submit-avatar">Add Avatar</button>
            </div>
        </div>
    </div>
</div>

<!-- Rename Avatar Modal -->
<div class="modal fade" id="renameAvatarModal" tabindex="-1" role="dialog" aria-labelledby="renameAvatarModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header d-flex justify-content-between align-items-center">
                <h5 class="modal-title" id="renameAvatarModalLabel">Rename Avatar</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="rename-avatar-form">
                    <div class="form-group">
                        <label for="new-avatar-name">New Avatar Name</label>
                        <input type="text" class="form-control" id="new-avatar-name" required>
                    </div>
                    <input type="hidden" id="rename-avatar-id">
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="submit-rename-avatar">Rename</button>
            </div>
        </div>
    </div>
</div>

<!-- Delete Avatar Confirmation Modal -->
<div class="modal fade" id="deleteAvatarModal" tabindex="-1" role="dialog" aria-labelledby="deleteAvatarModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header d-flex justify-content-between align-items-center">
                <h5 class="modal-title" id="deleteAvatarModalLabel">Confirm Delete</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete this avatar? This action cannot be undone.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirm-delete-avatar">Delete</button>
            </div>
        </div>
    </div>
</div>