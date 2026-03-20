document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.service-nav-link');
    const sections = document.querySelectorAll('.service-detail-card');
    const header = document.querySelector('.header');

    const hasNav = navLinks.length && sections.length;

    function updateActiveLink() {
        if (!hasNav) {
            return;
        }

        let current = '';
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        if (scrollPosition < sections[0].offsetTop - 100) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }

    if (hasNav) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = header ? header.offsetHeight : 140;

                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });

                    history.pushState(null, null, targetId);
                }
            });
        });

        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                setTimeout(() => {
                    const headerHeight = header ? header.offsetHeight : 140;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();

        const serviceCards = document.querySelectorAll('.service-detail-card');
        serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';

            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });

        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(10px)';

            setTimeout(() => {
                link.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, index * 100 + 500);
        });
    }

    const catalogTabs = document.querySelectorAll('[data-catalog-tab]');
    const catalogPanels = document.querySelectorAll('[data-catalog-panel]');
    const catalogGroupTabs = document.querySelectorAll('[data-catalog-group]');
    const catalogGroupPanels = document.querySelectorAll('[data-catalog-group-panel]');
    const catalogLayout = document.querySelector('[data-catalog-layout]');

    if (catalogTabs.length && catalogPanels.length) {
        const lastActiveTabByGroup = new Map();

        const getCatalogHashState = (hashValue = window.location.hash) => {
            const hashId = hashValue ? hashValue.replace('#', '') : '';
            if (!hashId) {
                return null;
            }

            const targetElement = document.getElementById(hashId);
            if (!targetElement) {
                return null;
            }

            const directTab = Array.from(catalogTabs).find((tab) => tab.dataset.catalogTab === hashId);
            if (directTab) {
                return { panelId: hashId, targetElement };
            }

            const parentPanel = targetElement.closest('[data-catalog-panel]');
            if (parentPanel) {
                return { panelId: parentPanel.id, targetElement };
            }

            return null;
        };

        const scrollCatalogTarget = (targetElement, smooth = true) => {
            if (!targetElement) {
                return;
            }

            const headerHeight = header ? header.offsetHeight : 140;
            window.scrollTo({
                top: targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 12,
                behavior: smooth ? 'smooth' : 'auto'
            });
        };

        const activateCatalogGroup = (groupId) => {
            if (!catalogGroupTabs.length || !catalogGroupPanels.length) {
                return;
            }

            if (catalogLayout) {
                catalogLayout.dataset.activeGroup = groupId;
            }

            catalogGroupTabs.forEach((groupTab) => {
                const isActive = groupTab.dataset.catalogGroup === groupId;
                groupTab.classList.toggle('is-active', isActive);
            });

            catalogGroupPanels.forEach((groupPanel) => {
                const isActive = groupPanel.dataset.catalogGroupPanel === groupId;
                groupPanel.classList.toggle('is-active', isActive);
                groupPanel.hidden = !isActive;
            });
        };

        const activateCatalogTab = (panelId) => {
            catalogTabs.forEach((tab) => {
                const isActive = tab.dataset.catalogTab === panelId;
                tab.classList.toggle('is-active', isActive);
            });

            catalogPanels.forEach((panel) => {
                const isActive = panel.id === panelId;
                panel.classList.toggle('is-active', isActive);
                panel.hidden = !isActive;
            });

            const activeTab = Array.from(catalogTabs).find((tab) => tab.dataset.catalogTab === panelId);
            const groupPanel = activeTab ? activeTab.closest('[data-catalog-group-panel]') : null;
            if (groupPanel) {
                lastActiveTabByGroup.set(groupPanel.dataset.catalogGroupPanel, panelId);
                activateCatalogGroup(groupPanel.dataset.catalogGroupPanel);
            }
        };

        catalogGroupTabs.forEach((groupTab) => {
            groupTab.addEventListener('click', () => {
                const groupId = groupTab.dataset.catalogGroup;
                const groupPanel = Array.from(catalogGroupPanels).find((panel) => panel.dataset.catalogGroupPanel === groupId);
                const groupTabsList = groupPanel ? Array.from(groupPanel.querySelectorAll('[data-catalog-tab]')) : [];
                const rememberedPanelId = lastActiveTabByGroup.get(groupId);
                const targetTab =
                    groupTabsList.find((tab) => tab.dataset.catalogTab === rememberedPanelId) ||
                    groupTabsList[0];

                if (targetTab) {
                    activateCatalogTab(targetTab.dataset.catalogTab);
                } else {
                    activateCatalogGroup(groupId);
                }
            });
        });

        catalogTabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                activateCatalogTab(tab.dataset.catalogTab);
                const panelId = tab.dataset.catalogTab;
                if (panelId) {
                    history.replaceState(null, '', `#${panelId}`);
                }
            });
        });

        const hashState = getCatalogHashState();
        let initialTab = document.querySelector('.catalog-link.is-active') || catalogTabs[0];
        if (hashState) {
            const hashTab = Array.from(catalogTabs).find((tab) => tab.dataset.catalogTab === hashState.panelId);
            if (hashTab) {
                initialTab = hashTab;
            }
        }

        if (initialTab) {
            activateCatalogTab(initialTab.dataset.catalogTab);
        } else if (catalogGroupTabs.length) {
            activateCatalogGroup(catalogGroupTabs[0].dataset.catalogGroup);
        }

        if (hashState) {
            setTimeout(() => {
                scrollCatalogTarget(hashState.targetElement, false);
            }, 60);
        }

        window.addEventListener('hashchange', () => {
            const currentHashState = getCatalogHashState();
            if (!currentHashState) {
                return;
            }

            activateCatalogTab(currentHashState.panelId);

            setTimeout(() => {
                scrollCatalogTarget(currentHashState.targetElement, true);
            }, 60);
        });
    }

    document.querySelectorAll('[data-catalog-gallery]').forEach((gallery) => {
        const mainLink = gallery.querySelector('[data-gallery-main-link]');
        const mainImage = gallery.querySelector('[data-gallery-main-image]');
        const thumbs = Array.from(gallery.querySelectorAll('.catalog-panel__media-thumb'));
        const hiddenLinks = Array.from(gallery.querySelectorAll('[data-gallery-lightbox-link]'));
        const prevBtn = gallery.querySelector('.catalog-panel__media-nav--prev');
        const nextBtn = gallery.querySelector('.catalog-panel__media-nav--next');

        if (!mainLink || !mainImage || !thumbs.length) {
            return;
        }

        let activeIndex = thumbs.findIndex((thumb) => thumb.classList.contains('is-active'));
        if (activeIndex < 0) {
            activeIndex = 0;
            thumbs[0].classList.add('is-active');
        }

        const syncGallery = (index) => {
            const thumb = thumbs[index];
            if (!thumb) {
                return;
            }

            const src = thumb.dataset.gallerySrc;
            const alt = thumb.dataset.galleryAlt || '';
            const title = thumb.dataset.galleryTitle || alt || '';

            if (!src) {
                return;
            }

            activeIndex = index;
            mainLink.href = src;
            mainLink.title = title;
            mainImage.src = src;
            mainImage.alt = alt;

            const thumbImage = thumb.querySelector('img');
            const width = thumbImage?.getAttribute('width');
            const height = thumbImage?.getAttribute('height');

            if (width && height) {
                mainImage.width = Number(width);
                mainImage.height = Number(height);
            }

            thumbs.forEach((item, itemIndex) => {
                item.classList.toggle('is-active', itemIndex === activeIndex);
            });

            thumb.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        };

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => syncGallery(index));
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const nextIndex = (activeIndex - 1 + thumbs.length) % thumbs.length;
                syncGallery(nextIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const nextIndex = (activeIndex + 1) % thumbs.length;
                syncGallery(nextIndex);
            });
        }

        mainLink.addEventListener('click', (event) => {
            const hiddenLink = hiddenLinks[activeIndex];
            if (!hiddenLink) {
                return;
            }
            event.preventDefault();
            hiddenLink.click();
        });

        syncGallery(activeIndex);
    });

});
