<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class StoreResourceRequest extends BaseFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => ['required', Rule::in(['project', 'task', 'inventory', 'document', 'other'])],
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed', 'cancelled'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date|after:now',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The resource name is required.',
            'name.max' => 'The resource name cannot exceed 255 characters.',
            'type.required' => 'The resource type is required.',
            'type.in' => 'The selected resource type is invalid.',
            'status.required' => 'The resource status is required.',
            'status.in' => 'The selected resource status is invalid.',
            'priority.required' => 'The resource priority is required.',
            'priority.in' => 'The selected resource priority is invalid.',
            'assigned_to.exists' => 'The selected assigned user does not exist.',
            'due_date.date' => 'The due date must be a valid date.',
            'due_date.after' => 'The due date must be in the future.',
            'tags.array' => 'Tags must be an array.',
            'tags.*.string' => 'Each tag must be a string.',
            'tags.*.max' => 'Each tag cannot exceed 50 characters.',
        ];
    }
} 