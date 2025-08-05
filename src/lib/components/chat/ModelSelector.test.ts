import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ModelSelector from './ModelSelector.svelte';
import { models, settings, showSettings } from '$lib/stores';
import { get } from 'svelte/store';
import toast from 'svelte-french-toast';

vi.mock('$lib/stores', () => {
  const { writable } = require('svelte/store');
  return {
    models: writable([
      { name: 'llama2', details: { family: 'llama', parameter_size: '7B' } },
      { name: 'mistral', details: { family: 'mistral', parameter_size: '7B' } },
      { name: 'hr' }, // Separator
      { name: 'codellama', details: { family: 'codellama', parameter_size: '7B' } },
    ]),
    settings: writable({
      ollamaApiBaseUrl: 'http://localhost:11434',
      authHeader: null,
      notificationEnabled: false,
      responseAutoCopy: false,
      titleAutoGenerate: true,
      models: [], // Default models setting
    }),
    showSettings: writable(false),
  };
});

vi.mock('svelte-french-toast', () => {
  const toast = {
    success: vi.fn(),
    error: vi.fn(),
  };
  return {
    default: toast,
    toast: toast // Provide both named and default export for flexibility
  };
});

describe('ModelSelector', () => {
  // Scenario 1: การเลือกโมเดล (Model Selection)
  it('should render model options and allow selection', async () => {
    let selectedModels = [''];
    render(ModelSelector, { props: { selectedModels, disabled: false } });

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    // Check if options are rendered
    expect(screen.getByRole('option', { name: 'เลือกโมเดล' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'llama2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'mistral' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'codellama' })).toBeInTheDocument();

    // Select a model
    await fireEvent.change(selectElement, { target: { value: 'llama2' } });

    // Verify the selected value (this requires the parent component to update selectedModels)
    // Since selectedModels is a prop, we need to check its value in the test scope after the change.
    // For this test, we'll confirm the select element's value changes.
    expect(selectElement.value).toBe('llama2');
  });

  it('should disable the selector when `disabled` prop is true', () => {
    let selectedModels = [''];
    render(ModelSelector, { props: { selectedModels, disabled: true } });

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeDisabled();
  });

  it('should open settings modal when "ดู" button is clicked', async () => {
    let selectedModels = [''];
    render(ModelSelector, { props: { selectedModels, disabled: false } });

    const viewButton = screen.getByRole('button', { name: 'ดู' });
    await fireEvent.click(viewButton);

    expect(get(showSettings)).toBe(true);
  });

  it('should save the selected model as default and show a success toast', async () => {
    let selectedModels = ['llama2']; // Simulate a selected model
    render(ModelSelector, { props: { selectedModels, disabled: false } });

    const setDefaultButton = screen.getByRole('button', { name: 'ตั้งเป็นค่าเริ่มต้น' });
    await fireEvent.click(setDefaultButton);

    expect(get(settings).models).toEqual(['llama2']);
    expect(toast.success).toHaveBeenCalledWith('ตั้งเป็นโมเดลเริ่มต้นแล้ว');
  });

  // Scenario 2: การลบโมเดล (Model Deletion) - This functionality is in SettingsModal, not ModelSelector
  // However, we can test that the ModelSelector reacts correctly if a model is removed from the `models` store.
  it('should reflect changes in available models', async () => {
    let selectedModels = ['llama2'];
    const { rerender } = render(ModelSelector, { props: { selectedModels, disabled: false } });

    // Initially, llama2 should be present
    expect(screen.getByRole('option', { name: 'llama2' })).toBeInTheDocument();

    // Simulate model deletion by updating the models store
    models.set([
      { name: 'mistral', details: { family: 'mistral', parameter_size: '7B' } },
      { name: 'codellama', details: { family: 'codellama', parameter_size: '7B' } },
    ]);

    // Svelte components react automatically to store changes. We use waitFor to ensure DOM updates.
    await screen.findByText('mistral'); // Wait for mistral to be present

    // llama2 should no longer be in the document
    expect(screen.queryByRole('option', { name: 'llama2' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'mistral' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'codellama' })).toBeInTheDocument();
  });
});