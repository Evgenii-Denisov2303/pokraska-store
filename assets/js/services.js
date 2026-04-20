document.addEventListener('DOMContentLoaded', async function() {
    const navLinks = document.querySelectorAll('.service-nav-link');
    const sections = document.querySelectorAll('.service-detail-card');
    const header = document.querySelector('.header');
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    const shouldResetCatalogScroll =
        !window.location.hash &&
        navigationEntry &&
        navigationEntry.type === 'navigate';
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

    const catalogLayout = document.querySelector('[data-catalog-layout]');
    const catalogContent = document.querySelector('.catalog-content[data-catalog-panels-source]');
    const catalogGroupCurrent = document.querySelector('[data-catalog-group-current]');

    async function loadDeferredCatalogPanels() {
        if (!catalogContent || catalogContent.dataset.catalogPanelsLoaded === 'true') {
            return;
        }

        const source = catalogContent.getAttribute('data-catalog-panels-source');
        if (!source) {
            catalogContent.dataset.catalogPanelsLoaded = 'true';
            return;
        }

        catalogContent.setAttribute('aria-busy', 'true');

        try {
            const response = await fetch(source, { cache: 'default' });
            if (!response.ok) {
                throw new Error(`Failed to load catalog panels: ${response.status}`);
            }

            const markup = await response.text();
            if (markup.trim()) {
                catalogContent.insertAdjacentHTML('beforeend', markup);
            }

            catalogContent.dataset.catalogPanelsLoaded = 'true';
        } catch (error) {
            console.error(error);
            catalogContent.dataset.catalogPanelsLoadError = 'true';
        } finally {
            catalogContent.removeAttribute('aria-busy');
        }
    }

    await loadDeferredCatalogPanels();

    const catalogTabs = document.querySelectorAll('[data-catalog-tab]');
    const catalogPanels = document.querySelectorAll('[data-catalog-panel]');
    const catalogGroupTabs = document.querySelectorAll('[data-catalog-group]');
    const catalogGroupPanels = document.querySelectorAll('[data-catalog-group-panel]');

    if (catalogTabs.length && catalogPanels.length) {
        const lastActiveTabByGroup = new Map();

        const embedCatalogPanelHeaders = () => {
            catalogPanels.forEach((panel) => {
                if (panel.dataset.inlineHeaderReady === 'true') {
                    return;
                }

                const panelGrid = panel.querySelector(':scope > .catalog-panel__grid');
                const firstTextBlock = panelGrid?.querySelector('.catalog-panel__text');
                let breadcrumbsText = panel.dataset.catalogBreadcrumb?.trim() || '';
                let titleText = panel.dataset.catalogTitle?.trim() || '';

                if (!breadcrumbsText || !titleText) {
                    const panelHeader = panel.querySelector(':scope > .catalog-panel__header');
                    breadcrumbsText ||= panelHeader?.querySelector('.catalog-breadcrumbs')?.textContent?.trim() || '';
                    titleText ||= panelHeader?.querySelector('h2')?.textContent?.trim() || '';
                }

                if (!firstTextBlock || (!breadcrumbsText && !titleText)) {
                    return;
                }

                const inlineHeader = document.createElement('div');
                inlineHeader.className = 'catalog-panel__inline-header';

                if (breadcrumbsText) {
                    const inlineBreadcrumbs = document.createElement('div');
                    inlineBreadcrumbs.className = 'catalog-panel__inline-breadcrumbs';
                    inlineBreadcrumbs.textContent = breadcrumbsText;
                    inlineHeader.appendChild(inlineBreadcrumbs);
                }

                if (titleText) {
                    const inlineTitle = document.createElement('h2');
                    inlineTitle.className = 'catalog-panel__inline-title';
                    inlineTitle.textContent = titleText;
                    inlineHeader.appendChild(inlineTitle);
                }

                if (inlineHeader.childNodes.length) {
                    firstTextBlock.prepend(inlineHeader);
                }

                panel.dataset.inlineHeaderReady = 'true';
            });
        };

        const getCatalogGroupTab = (groupId) => Array.from(catalogGroupTabs).find((tab) => tab.dataset.catalogGroup === groupId);
        const getCatalogGroupPanel = (groupId) => Array.from(catalogGroupPanels).find((panel) => panel.dataset.catalogGroupPanel === groupId);

        const getCatalogGroupTitle = (groupId) => {
            const groupTab = getCatalogGroupTab(groupId);
            if (!groupTab) {
                return '';
            }

            const titleElement = groupTab.querySelector('.catalog-group-tab__title');
            return (titleElement ? titleElement.textContent : groupTab.textContent).trim();
        };

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

        const catalogTargetNeedsScroll = (targetElement) => {
            if (!targetElement) {
                return false;
            }

            const headerHeight = header ? header.offsetHeight : 140;
            const rect = targetElement.getBoundingClientRect();
            const topBoundary = headerHeight + 24;
            const bottomBoundary = window.innerHeight - 120;

            return rect.top < topBoundary || rect.top > bottomBoundary;
        };

        let panelPulseTimeout = null;

        const pulseCatalogPanel = (panelElement) => {
            if (!panelElement) {
                return;
            }

            panelElement.classList.remove('catalog-panel--pulse');
            void panelElement.offsetWidth;
            panelElement.classList.add('catalog-panel--pulse');

            if (panelPulseTimeout) {
                clearTimeout(panelPulseTimeout);
            }

            panelPulseTimeout = setTimeout(() => {
                panelElement.classList.remove('catalog-panel--pulse');
            }, 900);
        };

        const activateCatalogGroup = (groupId) => {
            if (!catalogGroupTabs.length || !catalogGroupPanels.length) {
                return;
            }

            if (catalogLayout) {
                catalogLayout.dataset.activeGroup = groupId;
            }

            if (catalogGroupCurrent) {
                catalogGroupCurrent.textContent = getCatalogGroupTitle(groupId);
            }

            catalogGroupTabs.forEach((groupTab) => {
                const isActive = groupTab.dataset.catalogGroup === groupId;
                groupTab.classList.toggle('is-active', isActive);
                groupTab.setAttribute('aria-expanded', String(isActive));
                groupTab.setAttribute('aria-selected', String(isActive));
            });

            catalogGroupPanels.forEach((groupPanel) => {
                const isActive = groupPanel.dataset.catalogGroupPanel === groupId;
                groupPanel.classList.toggle('is-active', isActive);
                groupPanel.hidden = !isActive;
                groupPanel.setAttribute('aria-hidden', String(!isActive));
                groupPanel.style.removeProperty('display');
            });
        };

        const activateCatalogTab = (panelId) => {
            catalogTabs.forEach((tab) => {
                const isActive = tab.dataset.catalogTab === panelId;
                tab.classList.toggle('is-active', isActive);
                tab.setAttribute('aria-pressed', String(isActive));
            });

            catalogPanels.forEach((panel) => {
                const isActive = panel.id === panelId;
                panel.classList.toggle('is-active', isActive);
                panel.hidden = !isActive;
                panel.setAttribute('aria-hidden', String(!isActive));
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
                const groupPanel = getCatalogGroupPanel(groupId);
                const groupTabsList = groupPanel ? Array.from(groupPanel.querySelectorAll('[data-catalog-tab]')) : [];
                const rememberedPanelId = lastActiveTabByGroup.get(groupId);
                const targetTab =
                    groupTabsList.find((tab) => tab.dataset.catalogTab === rememberedPanelId) ||
                    groupTabsList[0];

                if (targetTab) {
                    activateCatalogTab(targetTab.dataset.catalogTab);
                    history.replaceState(null, '', `#${targetTab.dataset.catalogTab}`);
                    requestAnimationFrame(() => {
                        const targetPanel = document.getElementById(targetTab.dataset.catalogTab);
                        if (targetPanel && catalogTargetNeedsScroll(targetPanel)) {
                            scrollCatalogTarget(targetPanel, true);
                        }
                    });
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
                    requestAnimationFrame(() => {
                        const targetPanel = document.getElementById(panelId);
                        if (targetPanel) {
                            if (catalogTargetNeedsScroll(targetPanel)) {
                                scrollCatalogTarget(targetPanel, true);
                            }
                            pulseCatalogPanel(targetPanel);
                        }
                    });
                }
            });
        });

        catalogGroupTabs.forEach((groupTab) => {
            const groupId = groupTab.dataset.catalogGroup;
            const groupPanel = getCatalogGroupPanel(groupId);

            if (!groupTab.id) {
                groupTab.id = `catalog-group-tab-${groupId}`;
            }

            groupTab.setAttribute('role', 'tab');
            groupTab.setAttribute('aria-haspopup', 'true');

            if (groupPanel) {
                if (!groupPanel.id) {
                    groupPanel.id = `catalog-group-panel-${groupId}`;
                }

                groupTab.setAttribute('aria-controls', groupPanel.id);
                groupPanel.setAttribute('role', 'tabpanel');
                groupPanel.setAttribute('aria-labelledby', groupTab.id);
            }
        });

        const hashState = getCatalogHashState();
        let initialTab = document.querySelector('.catalog-link.is-active') || catalogTabs[0];
        if (hashState) {
            const hashTab = Array.from(catalogTabs).find((tab) => tab.dataset.catalogTab === hashState.panelId);
            if (hashTab) {
                initialTab = hashTab;
            }
        }

        embedCatalogPanelHeaders();

        if (initialTab) {
            activateCatalogTab(initialTab.dataset.catalogTab);
        } else if (catalogGroupTabs.length) {
            activateCatalogGroup(catalogGroupTabs[0].dataset.catalogGroup);
        }

        if (hashState) {
            setTimeout(() => {
                scrollCatalogTarget(hashState.targetElement, false);
            }, 60);
        } else if (shouldResetCatalogScroll) {
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'auto'
                });
            });
        }

        window.addEventListener('hashchange', () => {
            const currentHashState = getCatalogHashState();
            if (!currentHashState) {
                return;
            }

            activateCatalogTab(currentHashState.panelId);

            setTimeout(() => {
                if (catalogTargetNeedsScroll(currentHashState.targetElement)) {
                    scrollCatalogTarget(currentHashState.targetElement, true);
                }
            }, 60);
        });
    }

    document.querySelectorAll('[data-catalog-gallery]').forEach((gallery) => {
        const mainLink = gallery.querySelector('[data-gallery-main-link]');
        const mainImage = gallery.querySelector('[data-gallery-main-image]');
        const prevBtn = gallery.querySelector('.catalog-panel__media-nav--prev');
        const nextBtn = gallery.querySelector('.catalog-panel__media-nav--next');
        const thumbsWrap = gallery.querySelector('.catalog-panel__media-thumbs');

        const getThumbs = () => Array.from(gallery.querySelectorAll('.catalog-panel__media-thumb')).filter((thumb) => !thumb.hidden);

        if (!mainLink || !mainImage || !getThumbs().length) {
            return;
        }

        const preloadImage = (src) => {
            if (!src) {
                return Promise.resolve(null);
            }

            return new Promise((resolve) => {
                const image = new Image();
                image.decoding = 'async';
                image.src = src;

                const finish = () => resolve(image);

                if (typeof image.decode === 'function') {
                    image.decode().then(finish).catch(finish);
                    return;
                }

                image.onload = finish;
                image.onerror = finish;
            });
        };

        const sameImageSource = (candidate, current) => {
            if (!candidate || !current) {
                return false;
            }

            try {
                return new URL(candidate, window.location.href).href === new URL(current, window.location.href).href;
            } catch (error) {
                return candidate === current;
            }
        };

        let activeIndex = getThumbs().findIndex((thumb) => thumb.classList.contains('is-active'));
        if (activeIndex < 0) {
            activeIndex = 0;
            getThumbs()[0]?.classList.add('is-active');
        }

        if (getThumbs().length === 1) {
            if (prevBtn) {
                prevBtn.style.display = 'none';
            }

            if (nextBtn) {
                nextBtn.style.display = 'none';
            }

            if (thumbsWrap) {
                thumbsWrap.style.display = 'none';
            }
        }

        const syncGallery = async (index) => {
            const thumbs = getThumbs();
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

            const width = Number(thumb.dataset.galleryWidth || thumb.querySelector('img')?.getAttribute('width') || mainImage.width || 0);
            const height = Number(thumb.dataset.galleryHeight || thumb.querySelector('img')?.getAttribute('height') || mainImage.height || 0);

            activeIndex = index;

            if (!sameImageSource(src, mainImage.currentSrc || mainImage.getAttribute('src'))) {
                await preloadImage(src);
            }

            activeIndex = index;
            mainLink.href = src;
            mainLink.title = title;
            mainImage.src = src;
            mainImage.alt = alt;

            if (width && height) {
                mainImage.width = width;
                mainImage.height = height;
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

        gallery.addEventListener('click', (event) => {
            const thumb = event.target.closest('.catalog-panel__media-thumb');
            if (!thumb || !gallery.contains(thumb) || thumb.hidden) {
                return;
            }

            const thumbs = getThumbs();
            void syncGallery(thumbs.indexOf(thumb));
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const thumbs = getThumbs();
                const nextIndex = (activeIndex - 1 + thumbs.length) % thumbs.length;
                void syncGallery(nextIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const thumbs = getThumbs();
                const nextIndex = (activeIndex + 1) % thumbs.length;
                void syncGallery(nextIndex);
            });
        }

        mainLink.addEventListener('click', (event) => {
            const lightboxApi = window.PokraskaLightbox;
            const thumbs = getThumbs();
            if (!lightboxApi || typeof lightboxApi.openGroup !== 'function' || !thumbs.length) {
                return;
            }

            event.preventDefault();

            lightboxApi.openGroup(
                thumbs.map((thumb) => ({
                    href: thumb.dataset.gallerySrc,
                    alt: thumb.dataset.galleryAlt || '',
                    title: thumb.dataset.galleryTitle || thumb.dataset.galleryAlt || ''
                })).filter((item) => item.href),
                activeIndex,
                mainLink
            );
        });

        syncGallery(activeIndex);
    });

});
