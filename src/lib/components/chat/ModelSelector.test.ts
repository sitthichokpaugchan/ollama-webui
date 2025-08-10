// นำเข้าฟังก์ชันและเครื่องมือที่จำเป็นสำหรับการทดสอบ
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ModelSelector from './ModelSelector.svelte';
import { models, settings, showSettings } from '$lib/stores';
import { get } from 'svelte/store';
import toast from 'svelte-french-toast';

// จำลอง (mock) svelte stores
vi.mock('$lib/stores', () => {
  const { writable } = require('svelte/store');
  return {
    models: writable([
      { name: 'llama2', details: { family: 'llama', parameter_size: '7B' } },
      { name: 'mistral', details: { family: 'mistral', parameter_size: '7B' } },
      { name: 'hr' }, // ตัวคั่น
      { name: 'codellama', details: { family: 'codellama', parameter_size: '7B' } },
    ]),
    settings: writable({
      ollamaApiBaseUrl: 'http://localhost:11434',
      authHeader: null,
      notificationEnabled: false,
      responseAutoCopy: false,
      titleAutoGenerate: true,
      models: [], // การตั้งค่าโมเดลเริ่มต้น
    }),
    showSettings: writable(false),
  };
});

// จำลอง (mock) svelte-french-toast
vi.mock('svelte-french-toast', () => {
  const toast = {
    success: vi.fn(),
    error: vi.fn(),
  };
  return {
    default: toast,
    toast: toast // จัดเตรียมทั้งการส่งออกชื่อและการส่งออกเริ่มต้นเพื่อความยืดหยุ่น
  };
});

// กลุ่มการทดสอบสำหรับ ModelSelector
describe('ModelSelector', () => {
  // สถานการณ์ที่ 1: การเลือกโมเดล
  it('should render model options and allow selection', async () => {
    let selectedModels = [''];
    render(ModelSelector, { props: { selectedModels, disabled: false } });

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    // ตรวจสอบว่าตัวเลือกถูกแสดงผลหรือไม่
    expect(screen.getByRole('option', { name: 'เลือกโมเดล' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'llama2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'mistral' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'codellama' })).toBeInTheDocument();

    // เลือกโมเดล
    await fireEvent.change(selectElement, { target: { value: 'llama2' } });

    // ตรวจสอบค่าที่เลือก (สิ่งนี้ต้องการให้คอมโพเนนต์หลักอัปเดต selectedModels)
    // เนื่องจาก selectedModels เป็น prop เราจึงต้องตรวจสอบค่าของมันในขอบเขตการทดสอบหลังจากการเปลี่ยนแปลง
    // สำหรับการทดสอบนี้ เราจะยืนยันว่าค่าขององค์ประกอบ select เปลี่ยนแปลง
    expect(selectElement.value).toBe('llama2');
  });

  // ทดสอบว่าตัวเลือกถูกปิดใช้งานเมื่อ prop `disabled` เป็น true
  it('should disable the selector when `disabled` prop is true', () => {
    let selectedModels = [''];
    render(ModelSelector, { props: { selectedModels, disabled: true } });

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeDisabled();
  });

  // ทดสอบว่า modal การตั้งค่าเปิดขึ้นเมื่อคลิกปุ่ม "ดู"
  it('should open settings modal when "ดู" button is clicked', async () => {
    let selectedModels = [''];
    render(ModelSelector, { props: { selectedModels, disabled: false } });

    const viewButton = screen.getByRole('button', { name: 'ดู' });
    await fireEvent.click(viewButton);

    expect(get(showSettings)).toBe(true);
  });

  // ทดสอบว่าโมเดลที่เลือกถูกบันทึกเป็นค่าเริ่มต้นและแสดง toast สำเร็จ
  it('should save the selected model as default and show a success toast', async () => {
    let selectedModels = ['llama2']; // จำลองโมเดลที่เลือก
    render(ModelSelector, { props: { selectedModels, disabled: false } });

    const setDefaultButton = screen.getByRole('button', { name: 'ตั้งเป็นค่าเริ่มต้น' });
    await fireEvent.click(setDefaultButton);

    expect(get(settings).models).toEqual(['llama2']);
    expect(toast.success).toHaveBeenCalledWith('ตั้งเป็นโมเดลเริ่มต้นแล้ว');
  });

  // สถานการณ์ที่ 2: การลบโมเดล - ฟังก์ชันนี้อยู่ใน SettingsModal ไม่ใช่ ModelSelector
  // อย่างไรก็ตาม เราสามารถทดสอบได้ว่า ModelSelector ตอบสนองอย่างถูกต้องหรือไม่หากโมเดลถูกลบออกจาก `models` store
  it('should reflect changes in available models', async () => {
    let selectedModels = ['llama2'];
    const { rerender } = render(ModelSelector, { props: { selectedModels, disabled: false } });

    // ในตอนแรก llama2 ควรจะปรากฏ
    expect(screen.getByRole('option', { name: 'llama2' })).toBeInTheDocument();

    // จำลองการลบโมเดลโดยการอัปเดต models store
    models.set([
      { name: 'mistral', details: { family: 'mistral', parameter_size: '7B' } },
      { name: 'codellama', details: { family: 'codellama', parameter_size: '7B' } },
    ]);

    // คอมโพเนนต์ Svelte ตอบสนองต่อการเปลี่ยนแปลง store โดยอัตโนมัติ เราใช้ waitFor เพื่อให้แน่ใจว่า DOM อัปเดต
    await screen.findByText('mistral'); // รอให้ mistral ปรากฏ

    // llama2 ไม่ควรอยู่ในเอกสารอีกต่อไป
    expect(screen.queryByRole('option', { name: 'llama2' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'mistral' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'codellama' })).toBeInTheDocument();
  });
});
