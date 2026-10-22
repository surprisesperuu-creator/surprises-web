export interface CarouselOptions {
    containerId: string;
    trackId: string;
    prevBtnId?: string;
    nextBtnId?: string;
    speed?: number; // Píxeles por frame (ej. 1)
}

export class InfiniteCarousel {
    private container: HTMLElement | null;
    private track: HTMLElement | null;
    private prevBtn: HTMLElement | null = null;
    private nextBtn: HTMLElement | null = null;
    private speed: number;
    private currentX: number = 0;
    private isPaused: boolean = false;
    private halfWidth: number = 0;
    private animationId: number | null = null;

    constructor(options: CarouselOptions) {
        this.container = document.getElementById(options.containerId);
        this.track = document.getElementById(options.trackId);
        this.speed = options.speed ?? 1;

        if (options.prevBtnId) this.prevBtn = document.getElementById(options.prevBtnId);
        if (options.nextBtnId) this.nextBtn = document.getElementById(options.nextBtnId);

        if (this.container && this.track) {
            this.init();
        }
    }

    private init(): void {
        if (!this.track || !this.container) return;

        // Duplicar el contenido para hacer el bucle infinito sin saltos
        const originalCards = this.track.innerHTML;
        this.track.innerHTML = originalCards + originalCards;

        // Calcular ancho de la mitad
        this.calculateWidth();

        // Pausar en hover
        this.container.addEventListener('mouseenter', () => (this.isPaused = true));
        this.container.addEventListener('mouseleave', () => (this.isPaused = false));

        // Botones de navegación manual
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.scrollManual('left'));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.scrollManual('right'));
        }

        // Recalcular si se redimensiona la ventana
        window.addEventListener('resize', () => this.calculateWidth());

        // Iniciar loop
        this.animate();
    }

    private calculateWidth(): void {
        if (this.track) {
            this.halfWidth = this.track.scrollWidth / 2;
        }
    }

    private scrollManual(direction: 'left' | 'right'): void {
        const amount = 280; // Distancia de una tarjeta + gap
        if (direction === 'right') {
            this.currentX -= amount;
        } else {
            this.currentX += amount;
        }

        // Mantener dentro de los límites del bucle
        if (Math.abs(this.currentX) >= this.halfWidth) {
            this.currentX = 0;
        } else if (this.currentX > 0) {
            this.currentX = -this.halfWidth + amount;
        }

        if (this.track) {
            this.track.style.transform = `translate3d(${this.currentX}px, 0, 0)`;
        }
    }

    private animate = (): void => {
        if (!this.track) return;

        if (!this.isPaused) {
            this.currentX -= this.speed;

            if (Math.abs(this.currentX) >= this.halfWidth) {
                this.currentX = 0;
            }

            this.track.style.transform = `translate3d(${this.currentX}px, 0, 0)`;
        }

        this.animationId = requestAnimationFrame(this.animate);
    };

    public destroy(): void {
        if (this.animationId) cancelAnimationFrame(this.animationId);
    }
}