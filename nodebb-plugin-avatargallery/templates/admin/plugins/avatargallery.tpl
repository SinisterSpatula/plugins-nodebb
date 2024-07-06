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
                            <button id="add-avatar" class="btn btn-primary mb-3">
                                <i class="fa fa-plus"></i> Add New Avatar
                            </button>
                        </div>
                        <div class="col-lg-6">
                            <input type="text" class="form-control" id="avatar-search" placeholder="Search avatars...">
                        </div>
                    </div>

                    <div id="avatar-container" class="row">
                        <!-- BEGIN avatars -->
                        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                            <div class="card h-100">
                                <img src="{avatars.path}" class="card-img-top" alt="{avatars.name}">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">{avatars.name}</h5>
                                    <div class="card-text">
                                        <span class="fw-bold">Access:</span>
                                        <small class="fst-italic text-muted">{avatars.accessLevel}</small>
                                    </div>
                                    <div class="d-flex mt-auto w-100">
                                        <button type="button" class="btn btn-sm btn-outline-primary edit-avatar w-50 me-1" data-id="{avatars.id}">Edit</button>
                                        <button type="button" class="btn btn-sm btn-outline-danger delete-avatar w-50 ms-1" data-id="{avatars.id}">Delete</button>
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

<!-- Error Modal -->
<div class="modal fade" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="errorModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="errorModalLabel">Error</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p id="errorMessage"></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- Edit Avatar Modal -->
<div class="modal fade" id="editAvatarModal" tabindex="-1" role="dialog" aria-labelledby="editAvatarModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header d-flex justify-content-between align-items-center">
                <h5 class="modal-title" id="editAvatarModalLabel">Edit Avatar</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="edit-avatar-form">
                    <div class="mb-3">
                        <label for="edit-avatar-name" class="form-label">Avatar Name</label>
                        <input type="text" class="form-control" id="edit-avatar-name" required>
                    </div>
                    <div class="mb-3">
                        <label for="edit-avatar-access" class="form-label">Access Level</label>
                        <select class="form-select" id="edit-avatar-access" required>
                            <option value="users">All Users</option>
                            <option value="moderators">Moderators & Above</option>
                            <option value="global_moderators">Global Moderators & Administrators</option>
                            <option value="administrators">Administrators Only</option>
                        </select>
                    </div>
                    <input type="hidden" id="edit-avatar-id">
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="submit-edit-avatar">Save Changes</button>
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
<!-- The add avatar modal is located in avatargallery/templates/admin/plugins/addavatar_modal.tpl -->