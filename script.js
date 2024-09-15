
$(document).ready(function() {
    let highlightedRange;
    let commentCount = 0; // To keep track of the number of comments

    $(document).on('mouseup', function(event) {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        if (selectedText) {
            if (highlightedRange) {
                // Remove previous highlights
                document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
            }

            highlightedRange = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.className = 'highlight';
            span.textContent = selectedText;
            highlightedRange.deleteContents();
            highlightedRange.insertNode(span);

            // Show popup near the selected text
            const rect = span.getBoundingClientRect();
            $('#popup').show().css({
                top: rect.top + window.scrollY + rect.height + 10 + 'px',
                left: rect.left + window.scrollX + 'px'
            });

            $('#selected-text').text(selectedText);
            $('#popup').data('highlighted-span', span); // Store reference to the span
            $('#popup').data('comment-count', ++commentCount); // Update comment count
        }
    });

    $('#close-popup').on('click', function() {
        $('#popup').hide(); // Hide the popup
    });

    $('#save-comment').on('click', function() {
        const selectedText = $('#selected-text').text();
        const comment = $('#comment').val().trim();
        const commentNumber = $('#popup').data('comment-count');

        if (selectedText && comment) {
            // Create a new comment entry
            const commentDiv = $(`
                <div class="comment">
                    <div class="comment-header">
                        <div class="comment-number">Comment #${commentNumber}</div>
                        <button class="comment-toggle btn btn-sm">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    <div class="comment-content">
                        <div class="comment-ref">Selected text: "${selectedText}"<hr></div>
                        <div class="comment-text">Your Comment: "${comment}"<hr></div>
                        <div class="comment-actions">
                            <button class="edit-comment btn btn-sm btn-primary">Edit</button>
                            <button class="delete-comment btn btn-sm btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            `);

            $('#comments-list').append(commentDiv);

            $('#comment').val(''); // Clear the comment field
            $('#popup').hide(); // Hide the popup
        } else {
            alert('Please select text and add a comment.');
        }
    });

    // Toggle individual comment details
    $(document).on('click', '.comment-toggle', function() {
        const commentContent = $(this).closest('.comment').find('.comment-content');
        const isExpanded = commentContent.hasClass('expanded');
        
        if (isExpanded) {
            commentContent.removeClass('expanded');
            $(this).html('<i class="fas fa-chevron-down"></i>');
        } else {
            commentContent.addClass('expanded');
            $(this).html('<i class="fas fa-chevron-up"></i>');
        }
    });

    // Hide popup when clicking outside of it
    $(document).on('click', function(event) {
        if (!$(event.target).closest('#popup').length && !$(event.target).closest('#content').length) {
            $('#popup').hide();
        }
    });

    // Handle click on edit button
    $(document).on('click', '.edit-comment', function() {
        const commentDiv = $(this).closest('.comment');
        const commentText = commentDiv.find('.comment-text').text();

        // Create edit form
        const editForm = $(`
            <div class="edit-form">
                <textarea class="form-control">${commentText}</textarea>
                <button class="save-edit btn btn-sm btn-primary mt-2">Save</button>
                <button class="cancel-edit btn btn-sm btn-secondary mt-2">Cancel</button>
            </div>
        `);

        // Append edit form to the comment div
        commentDiv.append(editForm);
        editForm.show();
        $(this).hide(); // Hide the edit button
        commentDiv.find('.delete-comment').hide(); // Hide the delete button during editing
    });

    // Handle saving the edited comment
    $(document).on('click', '.save-edit', function() {
        const editForm = $(this).closest('.edit-form');
        const commentDiv = editForm.closest('.comment');
        const newCommentText = editForm.find('textarea').val().trim();

        if (newCommentText) {
            commentDiv.find('.comment-text').text(newCommentText);
            editForm.remove(); // Remove the edit form
            commentDiv.find('.edit-comment').show(); // Show the edit button again
            commentDiv.find('.delete-comment').show(); // Show the delete button again
        } else {
            alert('Comment cannot be empty.');
        }
    });

    // Handle cancelling the edit
    $(document).on('click', '.cancel-edit', function() {
        const editForm = $(this).closest('.edit-form');
        const commentDiv = editForm.closest('.comment');
        
        editForm.remove(); // Remove the edit form
        commentDiv.find('.edit-comment').show(); // Show the edit button again
        commentDiv.find('.delete-comment').show(); // Show the delete button again
    });

    // Handle click on delete button
    $(document).on('click', '.delete-comment', function() {
        if (confirm('Are you sure you want to delete this comment?')) {
            $(this).closest('.comment').remove(); // Remove the comment
        }
    });
});