import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  ElementRef,
  HostListener
} from "@angular/core";
import {
  ConnectionPositionPair,
  Overlay,
  OverlayRef
} from "@angular/cdk/overlay";

import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { TemplatePortal } from "@angular/cdk/portal";
import { PopoverService } from "./popover.service";

@Directive({
  selector: "[popoverTrigger]"
})
export class PopoverDirective implements OnDestroy, OnInit {
  @Input()
  popoverTrigger!: TemplateRef<object>;

  @Input()
  closeOnClickOutside: boolean = false;

  private unsubscribe = new Subject();
  private overlayRef!: OverlayRef;

  constructor(
    private elementRef: ElementRef,
    private overlay: Overlay,
    private vcr: ViewContainerRef,
    private popoverService: PopoverService
  ) {}

  ngOnInit(): void {
    this.createOverlay();
    this.popoverService.getState().subscribe(resp => {
      if (resp) {
        this.detachOverlay();
      }
    });
  }

  ngOnDestroy(): void {
    this.detachOverlay();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  @HostListener("click") clickou() {
    this.attachOverlay();
  }

  private createOverlay(): void {
    const scrollStrategy = this.overlay.scrollStrategies.block();
    const positionStrategy = this.overlay.position().connectedTo(
      this.elementRef,
      { originX: "start", originY: "bottom" },
      { overlayX: "start", overlayY: "top" }

      //ToDo entender como funciona o posicionamento
      // new ConnectionPositionPair(
      //   { originX: "start", originY: "bottom" },
      //   { overlayX: "start", overlayY: "bottom" }
      // ),
      // new ConnectionPositionPair(
      //   { originX: "start", originY: "bottom" },
      //   { overlayX: "start", overlayY: "bottom" }
      // )
    );

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy,
      hasBackdrop: true,
      backdropClass: ""
    });

    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        if (this.closeOnClickOutside) {
          this.detachOverlay();
        }
      });
  }

  private attachOverlay(): void {
    if (!this.overlayRef.hasAttached()) {
      const periodSelectorPortal = new TemplatePortal(
        this.popoverTrigger,
        this.vcr
      );

      this.overlayRef.attach(periodSelectorPortal);
    }
  }

  private detachOverlay(): void {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
